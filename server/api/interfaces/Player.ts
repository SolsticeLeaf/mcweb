import mongoose, { Schema, Document } from 'mongoose';

const headSkinUrl = process.env.MC_SKIN_HEAD || 'https://vzge.me/head/256/{name}?y=70&no=shadow';
const bustSkinUrl = process.env.MC_SKIN_BUST || 'https://vzge.me/bust/256/{name}';
const fullSkinUrl = process.env.MC_SKIN_FULL || 'https://vzge.me/full/256/{name}?no=shadow';

export interface Skin {
  head: string;
  bust: string;
  full: string;
}

export interface ServersData {
  serverId: string;
  health: number;
  food: number;
  inventory: Array<object>;
}

export interface PlayerData {
  _id: string;
  username: string;
  role: string;
  lastServer: Object;
  serversData: Array<ServersData>;
  money: number;
  skin: Skin;
}

export interface Player extends Document {
  _id: string;
  username: string;
  role: string;
  lastServer: Object;
  serversData: Array<ServersData>;
  money: number;
}

const ServersDataSchema: Schema = new Schema(
  {
    serverId: { type: String, required: true },
    health: { type: Number, required: true },
    food: { type: Number, required: true },
  },
  { _id: false }
);

const schema: Schema = new Schema(
  {
    _id: { type: String },
    username: { type: String, required: true },
    role: { type: String, required: true },
    lastServer: { type: Object, required: true },
    serversData: { type: [ServersDataSchema], required: true },
    money: { type: Number, required: true },
  },
  { collection: 'players' }
);

const PlayerModel = mongoose.model<Player>('players', schema);

export async function hasPlayer(id: string): Promise<boolean> {
  try {
    return (await PlayerModel.find({ _id: id })).length > 0;
  } catch (error) {
    console.error('❌ Error in hasPlayer:', error);
    return false;
  }
}

export async function createPlayer(id: string, username: string): Promise<void> {
  try {
    await PlayerModel.create({
      _id: id,
      username: username,
      role: 'USER',
      lastServer: 'undefined',
      serversData: [],
      money: 0,
    });
  } catch (error) {
    console.error('❌ Error in createPlayer:', error);
  }
}

export async function getPlayerById(id: string): Promise<PlayerData | undefined> {
  try {
    const players = await PlayerModel.find({ _id: id });
    if (players.length > 0) {
      return getPlayerData(players[0]);
    }
    return undefined;
  } catch (error) {
    console.error('❌ Error in getPlayerById:', error);
    return undefined;
  }
}

export async function setPlayersData(username: string, server: any, food: number, health: number, inventory: Array<object>): Promise<void> {
  try {
    await setPlayerLastServer(username, server);
    const player = await PlayerModel.findOne({ username: username });
    if (player) {
      const serverDataIndex = player.serversData.findIndex((data) => data.serverId === server._id);
      if (serverDataIndex > -1) {
        player.serversData[serverDataIndex].food = food;
        player.serversData[serverDataIndex].health = health;
        player.serversData[serverDataIndex].inventory = inventory;
      } else {
        player.serversData.push({
          serverId: server._id,
          health: health,
          food: food,
          inventory: [],
        });
      }
      await player.save();
    }
  } catch (error) {
    console.error('❌ Error in setPlayersData:', error);
  }
}

async function setPlayerLastServer(username: string, lastServer: object): Promise<void> {
  try {
    await PlayerModel.findOneAndUpdate({ username: username }, { lastServer: lastServer });
  } catch (error) {
    console.error('❌ Error in setPlayerLastServer:', error);
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
    serversData: player.serversData,
    skin: {
      head: replaceName(headSkinUrl, username),
      bust: replaceName(bustSkinUrl, username),
      full: replaceName(fullSkinUrl, username),
    },
  };
}

function replaceName(url: string, name: string): string {
  return url.replace('{name}', name);
}
