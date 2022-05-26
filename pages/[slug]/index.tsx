import {
  AllMatches,
  PlayerSelect,
  TeamSelect,
  TournamentHeading,
} from '@components/tournament';
import { Layout } from '@components/common';
import Modal from '@components/ui/Modal';
import { Dialog } from '@headlessui/react';
import { Match, Registrant, Team, Tournament, User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

interface TeamWithPlayers extends Team {
  players: User[];
}

interface TournamentWithRegistrantsAndMatches extends Tournament {
  registrants: Registrant[];
  matches: Match[];
}

interface TournamentPageProps {
  tournament: TournamentWithRegistrantsAndMatches;
  userId: string;
}

const fetchUser = async (userId: string) => {
  const request = await fetch(`/api/user/${userId}`);
  const user = await request.json();
  return user;
};

export default function TournamentPage({
  tournament,
  userId,
}: TournamentPageProps) {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [teamSelected, setTeamSelected] = useState<Team | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [team, setTeam] = useState<TeamWithPlayers | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalRounds, setTotalRounds] = useState<number[] | null>(null);
  const { data: user } = useQuery('user', () => fetchUser(userId));
  const isAdmin = userId === tournament.createdBy;

  const cancelButtonRef = useRef(null);

  const fetchTeamInfo = useCallback(async () => {
    if (!teamSelected) return;
    const request = await fetch(`/api/team/${teamSelected.id}`);
    const teamData = await request.json();
    setTeam(teamData);
  }, [teamSelected]);

  useEffect(() => {
    if (tournament.matches.length !== 0) {
      const rounds = tournament.matches
        .map((item) => item.round)
        .filter((value, index, self) => self.indexOf(value) === index);
      setTotalRounds(rounds);
    }
  }, []);

  useEffect(() => {
    if (!teamSelected) return;
    fetchTeamInfo();
    if (error) setError(null);
  }, [teamSelected, error, fetchTeamInfo]);

  const registerTeam = async (e: FormEvent) => {
    e.preventDefault();
    if (!team) {
      setError('No team selected.');
      return;
    }

    // TODO: Add some visual confirmation that this is complete
    await fetch(`/api/tournament/${tournament.id}/register`, {
      method: 'POST',
      body: JSON.stringify({ teamId: team?.id }),
    });
  };

  const startTournament = async () => {
    await fetch(`/api/tournament/${tournament.id}/start`);
    // if (request.status !== 200) {
    //   return;
    // }
  };

  return (
    <div>
      <TournamentHeading
        name={tournament.name}
        date={tournament.startDate}
        totalRegistrants={tournament.registrants.length}
        register={() => setRegisterModalOpen(true)}
        startTournament={startTournament}
        isAdmin={isAdmin}
      />
      <AllMatches matches={tournament.matches} rounds={totalRounds} />
      {registerModalOpen && (
        <Modal
          open={registerModalOpen}
          setOpen={(isOpen: boolean) => setRegisterModalOpen(isOpen)}
          initialFocus={cancelButtonRef}
        >
          <Dialog.Title
            as="h3"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            Register Team
          </Dialog.Title>
          <form className="mt-4" onSubmit={registerTeam}>
            <TeamSelect
              label="Choose Team"
              options={user.teams}
              selected={teamSelected}
              setSelected={(selectedTeam) => setTeamSelected(selectedTeam)}
            />
            {teamSelected && (
              <div>
                {!team ? (
                  <span>Loading...</span>
                ) : (
                  <PlayerSelect
                    players={team.players}
                    requiredPlayers={1}
                    selected={selectedPlayers.length}
                    addPlayer={(playerId) => {
                      const updatePlayers = [...selectedPlayers, playerId];
                      setSelectedPlayers(updatePlayers);
                    }}
                    removePlayer={(playerId) => {
                      const updatePlayers = selectedPlayers.filter(
                        (id) => playerId !== id,
                      );
                      setSelectedPlayers(updatePlayers);
                    }}
                  />
                )}
              </div>
            )}

            {error && (
              <span className="text-red-600 text-uppercase text-sm">
                {error}
              </span>
            )}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
              >
                Register
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => {
                  setRegisterModalOpen(false);
                  setTeam(null);
                  setTeamSelected(null);
                  setSelectedPlayers([]);
                }}
                ref={cancelButtonRef}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${context.params?.slug}`,
  );
  const tournament = await request.json();
  if (!tournament) {
    return { notFound: true };
  }

  const session = await getSession(context);
  const userId = session?.user.id;

  return { props: { tournament, userId } };
}

TournamentPage.Layout = Layout;
