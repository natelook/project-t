export interface Match {
  id: string;
  matchId: string;
  createdAt: Date;
  maps: Maps;
  map?: string;
  ip?: string;
  team1Players?: string[];
  team2Players?: string[];
  team1Score: number;
  team2Score: number;
}

export interface Maps {
  [key: string]: boolean;
}
