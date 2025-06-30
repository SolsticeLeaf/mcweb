export interface PlayerData {
  _id: string;
  username: string;
  role: string;
  lastServer: string;
  money: number;
  stats: Array<Object>;
  skin: Skin;
}

export interface Skin {
  head: string;
  bust: string;
  full: string;
}
