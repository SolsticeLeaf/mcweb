import { Player } from './../../../.nuxt/components.d';
import initialConfig from '~/config/initial.config';
import mongoose, { Schema, Document } from 'mongoose';

const skinRenderApi = initialConfig.skinRenderApi;

export interface ServersData {
  serverId: string;
  health: number;
  food: number;
  inventory: Array<Object>;
}

export interface PlayerData {
  _id: string;
  username: string;
  role: string;
  lastServer: Object;
  serversData: Array<ServersData>;
  money: number;
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
    inventory: { type: Array<Object>, required: true },
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

export async function setPlayersData(username: string, server: any, food: number, health: number, inventory: Array<any>): Promise<void> {
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
  return {
    _id: player._id,
    username: player.username,
    role: player.role,
    lastServer: player.lastServer,
    money: player.money,
    serversData: player.serversData,
  };
}

export async function getPlayers(amount: number): Promise<Player[]> {
  try {
    return await PlayerModel.aggregate([{ $sample: { size: amount } }]);
  } catch (error) {
    console.error('❌ Error in getPlayers:', error);
    return [];
  }
}
