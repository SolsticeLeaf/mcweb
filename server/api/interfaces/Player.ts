import initialConfig from '~/config/initial.config';
import mongoose, { Schema, Document } from 'mongoose';

const skinRenderApi = initialConfig.skinRenderApi;

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
  const username = player.username;
  return {
    _id: player._id,
    username: player.username,
    role: player.role,
    lastServer: player.lastServer,
    money: player.money,
    serversData: player.serversData,
    skin: {
      default: {
        full: `${skinRenderApi}/default/${username}/full`,
        bust: `${skinRenderApi}/default/${username}/bust`,
        face: `${skinRenderApi}/default/${username}/face`,
      },
      isometric: {
        full: `${skinRenderApi}/isometric/${username}/full`,
        bust: `${skinRenderApi}/isometric/${username}/bust`,
        face: `${skinRenderApi}/isometric/${username}/face`,
      },
      mojavatar: {
        full: `${skinRenderApi}/mojavatar/${username}/full`,
        face: `${skinRenderApi}/mojavatar/${username}/face`,
      },
      walking: {
        full: `${skinRenderApi}/walking/${username}/full`,
        bust: `${skinRenderApi}/walking/${username}/bust`,
        face: `${skinRenderApi}/walking/${username}/face`,
      },
      head: {
        full: `${skinRenderApi}/head/${username}/full`,
      },
    },
  };
}
