import {
  Dispute,
  Match,
  Registrant,
  Team,
  TeamInvitation,
  Tournament,
  User,
} from '@prisma/client';

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

export interface RegistrantWithTeamInfo extends Registrant {
  team: TeamWithPlayers;
}

export interface TournamentWithRegistrants extends Tournament {
  registrants: RegistrantWithTeamInfo[];
}

export interface MatchWithTeam extends Match {
  teamOne: Team;
  teamTwo: Team;
}

export interface MatchWithTeamsAndTournament extends Match {
  teamOne: TeamWithPlayersAndOwner;
  teamTwo: TeamWithPlayersAndOwner;
  tournament: Tournament;
}

export interface RegistrantWithTournamentInfo extends Registrant {
  tournament: Tournament;
}

export interface PostProps {
  id: string;
  title: string;
  slug: string;
  // @ts-ignore
  body: TypedObject;
  createdAt: Date;
}

export interface Noun {
  head: number;
  body: number;
  accessory: number;
  glasses: number;
}

export type NotifcationColors = 'danger' | 'primary' | 'success';

export interface DisputeWithReporterAndTeam extends Dispute {
  reporter: User;
  team: Team;
}
