import mongoose, { Schema, Document } from 'mongoose';

export interface ServersLog extends Document {
  serverId: string;
  player: string;
  type: string;
  data: any;
}

export interface LocalizationString {
  en: string;
  ru: string;
}

const schema: Schema = new Schema(
  {
    serverId: { type: String, required: true },
    player: { type: String, required: true },
    type: { type: String, required: true },
    data: { type: Object, required: true },
  },
  { collection: 'serversLog' }
);

const ServersLogModel = mongoose.model<ServersLog>('serversLog', schema);

export async function addServerLog(serverId: string, type: string, player: string, data: any): Promise<void> {
  try {
    await ServersLogModel.create({
      serverId: serverId,
      type: type,
      player: player,
      data: data,
    });
  } catch (error) {
    console.error('❌ Error in addServerLog:', error);
  }
}

export async function getLogs(amount: number, serverId: string, player: string): Promise<ServersLog[]> {
  if (serverId === '') {
    return await ServersLogModel.find({
      'data.advancement': { $not: /recipe/ },
    })
      .sort({ $natural: -1 })
      .limit(amount);
  } else {
    if (player === '') {
      return await ServersLogModel.find({
        serverId: serverId,
        'data.advancement': { $not: /recipe/ },
      })
        .sort({ $natural: -1 })
        .limit(amount);
    } else {
      return await ServersLogModel.find({
        serverId: serverId,
        player: player,
        'data.advancement': { $not: /recipe/ },
      })
        .sort({ $natural: -1 })
        .limit(amount);
    }
  }
}
