import mongoose, { Schema, Document } from 'mongoose';

export interface Server extends Document {
  _id: string;
  name: string;
  tags: object;
  description: LocalizationString;
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
    tags: { type: Object, required: true },
    description: { type: Object, required: true },
    map: { type: String, required: true },
    ip: { type: String, required: true },
  },
  { collection: 'servers' }
);

const ServerModel = mongoose.model<Server>('servers', schema);

export async function getServers(): Promise<Server[]> {
  return ServerModel.find();
}
