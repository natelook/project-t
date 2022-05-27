import { Team, TeamInvitation, Tournament, User } from '@prisma/client';

export interface TeamWithPlayersAndOwner extends Team {
  players: User[];
  owner: User;
}

export interface TeamInvitationWithTeam extends TeamInvitation {
  team: TeamWithPlayers;
}

export interface TeamWithPlayers extends Team {
  players: User[];
}

export interface UserWithTeamInvitations extends User {
  teamInvitations?: TeamInvitationWithTeam[];
}

export interface TournamentWithRegistrants extends Tournament {
  registrants: User[];
}
