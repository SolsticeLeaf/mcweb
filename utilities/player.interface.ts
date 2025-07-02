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
  default: {
    full: string;
    bust: string;
    face: string;
  };
  isometric: {
    full: string;
    bust: string;
    face: string;
  };
  mojavatar: {
    full: string;
    face: string;
  };
  walking: {
    full: string;
    bust: string;
    face: string;
  };
  head: {
    full: string;
  };
}
