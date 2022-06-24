import {
  AllMatches,
  PlayerSelect,
  TeamSelect,
  TournamentHeading,
} from '@components/tournament';
import { Layout } from '@components/common';
import Modal from '@components/ui/Modal';
import { Team, Tournament, User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import { Banner, Button, ModalHeading } from '@components/ui';
import { CheckIcon, PencilIcon } from '@heroicons/react/solid';
import { AnimatePresence } from 'framer-motion';
import SuperAdminTournament from '@components/admin/SuperAdminTournament';
import { MatchWithTeam, RegistrantWithTeamInfo } from '@lib/types';
import Image from 'next/image';
import TeamStackedList from '@components/common/TeamStackedList';
import getTotalRounds from '@lib/get-total-rounds';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { sanitize } from 'dompurify';

interface TeamWithPlayers extends Team {
  players: User[];
}

interface TournamentWithRegistrantsAndMatches extends Tournament {
  registrants: RegistrantWithTeamInfo[];
  matches: MatchWithTeam[];
}

interface TournamentPageProps {
  data: TournamentWithRegistrantsAndMatches;
  userId: string;
}

const fetchUser = async (userId: string) => {
  if (!userId) return null;

  const request = await fetch(`/api/user/${userId}`);
  const user = await request.json();
  return user;
};

const fetchTournament = async (slug: string) => {
  const request = await fetch(`/api/tournament/${slug}`);
  const tournament = await request.json();
  return tournament;
};

export default function TournamentPage({ data, userId }: TournamentPageProps) {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [teamSelected, setTeamSelected] = useState<Team | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [team, setTeam] = useState<TeamWithPlayers | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState<Team | null>(null);

  const [totalRounds, setTotalRounds] = useState<number[] | null>(null);
  const { data: user } = useQuery('user', () => fetchUser(userId));
  const isAdmin = useRef(userId === data.createdBy);
  const cancelButtonRef = useRef(null);
  const output = useMemo(
    () =>
      data.description &&
      generateHTML(JSON.parse(data.description), [
        StarterKit,
        // other extensions …
      ]),
    [data.description],
  );

  const { data: tournament, refetch } =
    useQuery<TournamentWithRegistrantsAndMatches>(
      `tournament-${data.id}`,
      () => fetchTournament(data.slug),
      {
        initialData: data,
      },
    );

  const fetchTeamInfo = useCallback(async () => {
    if (!teamSelected) return;
    const request = await fetch(`/api/team/${teamSelected.id}`);
    const teamData = await request.json();
    setTeam(teamData);
  }, [teamSelected]);

  useEffect(() => {
    if (data.matches.length !== 0) {
      const rounds = getTotalRounds(data.matches);
      setTotalRounds(rounds);
    }
  }, [data.matches]);

  useEffect(() => {
    if (!teamSelected) return;
    fetchTeamInfo();
    if (error) setError(null);
  }, [teamSelected, error, fetchTeamInfo]);

  useEffect(() => {
    if (registeredTeam) {
      setNotification(true);

      setTimeout(() => {
        setNotification(false);
      }, 5000);
    }

    return () => clearTimeout();
  }, [registeredTeam]);

  const registerTeam = async (e: FormEvent) => {
    e.preventDefault();
    if (!team) {
      setError('No team selected.');
      return;
    }

    const request = await fetch(`/api/tournament/${tournament.id}/register`, {
      method: 'POST',
      body: JSON.stringify({ teamId: team?.id }),
    });
    if (request.status !== 200) {
      setError('Something went wrong registering your team.');
      return;
    }

    const response = await request.json();
    refetch();
    setRegisteredTeam(response.team);
    setRegisterModalOpen(false);
    setTeam(null);
    setTeamSelected(null);
    setSelectedPlayers([]);
  };

  const startTournament = async () => {
    const request = await fetch(`/api/tournament/${tournament.id}/start`);
    if (request.status !== 200) {
      setError('Something went wrong');
      return;
    }
    refetch();
  };

  return (
    <div>
      <TournamentHeading
        name={tournament.name}
        date={tournament.startDate}
        totalRegistrants={tournament.registrants.length}
        maxRegistrants={tournament.maxRegistrants}
        game={tournament.game}
        register={() => setRegisterModalOpen(true)}
        startTournament={startTournament}
        isAdmin={isAdmin.current}
        isSignedIn={userId !== null}
        slug={tournament.slug}
      />
      <div className="mt-10">
        {tournament.started ? (
          <div>
            <h3 className="text-2xl font-bold mb-2">Tournament Bracket</h3>
            <div className="p-10 bg-gray-800 shadow shadow-gray-700 rounded">
              <AllMatches
                matches={tournament.matches}
                rounds={totalRounds}
                slug={tournament.slug}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-x-10 ">
            <div className="col-span-3">
              <h3 className="text-2xl font-bold mb-5">
                Tournament Rules and Information
              </h3>
              <div className="bg-gray-800 rounded-lg p-10 shadow shadow-gray-700">
                {tournament.banner && (
                  <div className="mb-5">
                    <Image
                      src={tournament.banner}
                      width="258px"
                      height="120px"
                      alt="Tournament Image"
                      layout="responsive"
                      className="rounded"
                    />
                  </div>
                )}
                {tournament.description && (
                  <div className="prose-invert prose w-full max-w-full">
                    <div
                      dangerouslySetInnerHTML={{ __html: sanitize(output) }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-5">Registered Teams</h3>
              <TeamStackedList
                team={tournament.registrants.map((reg) => ({ ...reg.team }))}
              />
            </div>
          </div>
        )}
      </div>
      {registerModalOpen && (
        <Modal
          open={registerModalOpen}
          setOpen={(isOpen: boolean) => setRegisterModalOpen(isOpen)}
          initialFocus={cancelButtonRef}
        >
          {user?.ownedTeams.length > 0 ? (
            <React.Fragment>
              <ModalHeading
                icon={<PencilIcon />}
                title="Register a Team"
                subtext=""
              />
              <form className="mt-4" onSubmit={registerTeam}>
                <TeamSelect
                  label="Choose Team"
                  options={user.ownedTeams}
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
                  <Button
                    label="Cancel Registration"
                    style="secondary"
                    onClick={() => {
                      setRegisterModalOpen(false);
                      setTeam(null);
                      setTeamSelected(null);
                      setSelectedPlayers([]);
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" label="Register Team">
                    Register
                  </Button>
                </div>
              </form>
            </React.Fragment>
          ) : (
            <p>You are not signed in.</p>
          )}
        </Modal>
      )}
      <AnimatePresence>
        {notification && registeredTeam && (
          <Banner
            message={`Successfully registered ${registeredTeam.name}`}
            icon={<CheckIcon />}
          />
        )}
      </AnimatePresence>
      {process.env.SUPERADMIN === userId && (
        <SuperAdminTournament tournamentId={tournament.id} />
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

  return { props: { data: tournament, userId: userId || null } };
}

TournamentPage.Layout = Layout;
