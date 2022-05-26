import { Team, User } from '@prisma/client';

export interface TeamWithPlayersAndOwner extends Team {
  players: User[];
  owner: User;
}
