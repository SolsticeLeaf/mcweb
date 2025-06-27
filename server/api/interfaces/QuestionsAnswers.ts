import mongoose, { Schema, Document } from 'mongoose';

export interface Qa extends Document {
  _id: string;
  locales: object;
}

const schema: Schema = new Schema(
  {
    _id: { type: String },
    locales: { type: Object, required: true },
  },
  { collection: 'qa' }
);

const QaModel = mongoose.model<Qa>('qa', schema);

export async function getQa(): Promise<Qa[]> {
  try {
    return await QaModel.find();
  } catch (error) {
    console.error('❌ Error fetching Q&A from database:', error);
    return [];
  }
}
