import mongoose, { Schema, Document } from "mongoose";

const headSkinUrl = process.env.MC_SKIN_HEAD || "https://vzge.me/head/256/{name}?y=70&no=shadow";
const bustSkinUrl = process.env.MC_SKIN_BUST || "https://vzge.me/bust/256/{name}";
const fullSkinUrl = process.env.MC_SKIN_FULL || "https://vzge.me/full/256/{name}?no=shadow";

export interface Skin {
  head: string;
  bust: string;
  full: string;
}

export interface PlayerData {
  _id: string;
  username: string;
  role: string;
  lastServer: string;
  money: number;
  stats: Array<Object>;
  skin: Skin;
}

export interface Player extends Document {
  _id: string;
  username: string;
  role: string;
  lastServer: string;
  money: number;
  stats: Array<Object>;
}

const schema: Schema = new Schema(
  {
    _id: { type: String },
    username: { type: String, required: true },
    role: { type: String, required: true },
    lastServer: { type: String, required: true },
    money: { type: Number, required: true },
    stats: { type: Array, required: true },
  },
  { collection: "players" }
);

const PlayerModel = mongoose.model<Player>("players", schema);

export async function hasPlayer(id: string): Promise<boolean> {
  try {
    return (await PlayerModel.find({ _id: id })).length > 0;
  } catch {
    return false;
  }
}

export async function createPlayer(id: string, username: string): Promise<void> {
  await PlayerModel.create({
    _id: id,
    username: username,
    role: "USER",
    lastServer: "undefined",
    money: 0,
    stats: [],
  });
}

export async function getPlayerByUsername(username: string): Promise<PlayerData | undefined> {
  try {
    const players = await PlayerModel.find({ username: username });
    if (players.length > 0) {
      return getPlayerData(players[0]);
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export async function getPlayerById(id: string): Promise<PlayerData | undefined> {
  try {
    const players = await PlayerModel.find({ _id: id });
    if (players.length > 0) {
      return getPlayerData(players[0]);
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function getPlayerData(player: Player): PlayerData {
  const username = player.username;
  return {
    _id: player._id,
    username: player.username,
    role: player.role,
    lastServer: player.lastServer,
    money: player.money,
    stats: player.stats,
    skin: {
      head: replaceName(headSkinUrl, username),
      bust: replaceName(bustSkinUrl, username),
      full: replaceName(fullSkinUrl, username),
    },
  };
}

function replaceName(url: string, name: string): string {
  return url.replace("{name}", name);
}
