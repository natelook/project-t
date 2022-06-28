import { TeamWithPlayers } from '@lib/types';
import { Team, Tournament } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import useNotification from './useNotification';

export default function useRegister(tournament: Tournament) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>();
  const [registeredTeam, setRegisteredTeam] = useState<Team | null>(null);
  const [selectedTeam, setTeamSelected] = useState<TeamWithPlayers | null>(
    null,
  );
  const [team, setTeam] = useState<TeamWithPlayers | null>(null);

  const { triggerNotification } = useNotification();

  const registerTeam = useCallback(async () => {
    if (!team) {
      setError('No team selected.');
      return;
    }

    const request = await fetch(`/api/tournament/${tournament.id}/register`, {
      method: 'POST',
      body: JSON.stringify({ teamId: team?.id }),
    });

    const response = await request.json();
    if (response.error) {
      setError(response.error);
      return;
    }

    if (request.status !== 200) {
      setError('Something went wrong registering your team.');
      return;
    }

    setRegisteredTeam(response.team);
    // setRegisterModalOpen(false);
    setTeam(null);
    setTeamSelected(null);
    setSelectedPlayers([]);
    triggerNotification(`Successfully registered ${response.team.name}`);
    // refetch();
  }, [team, tournament.id, triggerNotification]);

  const fetchTeamInfo = useCallback(async () => {
    if (!selectedTeam) return;
    const request = await fetch(`/api/team/${selectedTeam.id}`);
    const teamData = await request.json();
    setTeam(teamData);
  }, [selectedTeam]);

  useEffect(() => {
    if (!selectedTeam) return;
    fetchTeamInfo();
  }, [selectedTeam, error, fetchTeamInfo]);

  return {
    selectedTeam,
    selectedPlayers,
    error,
    registeredTeam,
    team,
    setSelectedPlayers,
    setTeamSelected,
    registerTeam,
  };
}
