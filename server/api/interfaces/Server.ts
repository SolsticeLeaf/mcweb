import mongoose, { Schema, Document } from 'mongoose';

export interface Server extends Document {
  _id: string;
  name: string;
  version: string;
  icon: string;
  tags: object;
  description: LocalizationString;
  serverColor: string;
  online: Array<string>;
  map: string;
  ip: string;
}

export interface LocalizationString {
  en: string;
  ru: string;
}

const schema: Schema = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    version: { type: String, required: true },
    icon: { type: String, required: true },
    serverColor: { type: String, required: true },
    tags: { type: Object, required: true },
    online: { type: Array, required: true },
    description: { type: Object, required: true },
    token: { type: String, required: true },
    map: { type: String, required: true },
    ip: { type: String, required: true },
  },
  { collection: 'servers' }
);

const ServerModel = mongoose.model<Server>('servers', schema);

export async function getServer(serverId: string): Promise<Server | undefined> {
  try {
    const servers = await ServerModel.find({ _id: serverId });
    if (servers.length > 0) {
      return servers[0];
    }
    return undefined;
  } catch (error) {
    console.error('❌ Error in getServer:', error);
    return undefined;
  }
}

export async function getServerByToken(token: string | undefined): Promise<Server | null> {
  try {
    if (token === undefined) return null;
    return await ServerModel.findOne({ token: token.replace('Bearer ', '').trim() });
  } catch (error) {
    console.error(`🛡️❌ Error on getting server by token "${token}":`, error);
    return null;
  }
}

export async function getServerByIp(ip: string): Promise<any> {
  try {
    const server = await ServerModel.findOne({ ip: ip });
    if (server !== null) {
      return server;
    }
  } catch (error) {
    console.error(`🛡️❌ Error on getting server by ip "${ip}":`, error);
  }
  return undefined;
}

export async function setOnline(serverId: string, online: Array<String>): Promise<void> {
  try {
    await ServerModel.findOneAndUpdate({ _id: serverId }, { online: online });
  } catch (error) {
    console.error(`🛡️❌ Error on setting server "${serverId}" online:`, error);
  }
}

export async function getServers(): Promise<Server[]> {
  return ServerModel.find();
}
