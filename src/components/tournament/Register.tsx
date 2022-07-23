import { Button } from '@components/ui';
import useRegister from '@lib/hooks/useRegister';
import { Team, Tournament } from '@prisma/client';
import { FormEvent } from 'react';
import PlayerSelect from './PlayerSelect';
import TeamSelect from './TeamSelect';

interface RegisterProps {
  tournament: Tournament;
  userTeams: Team[];
  cancel: () => void;
  // triggerNotification: () => void;
}

export default function Register({
  tournament,
  userTeams,
  cancel,
}: // triggerNotification,
RegisterProps) {
  const {
    registerTeam,
    setTeamSelected,
    setSelectedPlayers,
    selectedTeam,
    selectedPlayers,
    error,
    team,
  } = useRegister(tournament);

  return (
    <form
      className="mt-4"
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        registerTeam();
      }}
    >
      <TeamSelect
        label="Choose Team"
        options={userTeams}
        selected={selectedTeam}
        setSelected={(t) => setTeamSelected(t)}
      />
      {selectedTeam && (
        <div>
          {team ? (
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
          ) : (
            <span>Loading...</span>
          )}
        </div>
      )}

      {error && (
        <span className="text-red-600 text-uppercase text-sm">{error}</span>
      )}
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <Button
          label="Cancel Registration"
          style="secondary"
          onClick={() => {
            cancel();
            // setRegisterModalOpen(false);
            // setTeam(null);
            // setTeamSelected(null);
            // setSelectedPlayers([]);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" label="Register Team">
          Register
        </Button>
      </div>
    </form>
  );
}
