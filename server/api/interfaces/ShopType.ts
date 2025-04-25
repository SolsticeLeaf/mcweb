import mongoose, { Schema, Document } from 'mongoose';

export interface ShopType extends Document {
    _id: string;
    name: LocalizationString;
}

export interface LocalizationString {
    en: string;
    ru: string;
}

const schema: Schema = new Schema({
    _id: { type: String },
    name: { type: Object, required: true }
}, { collection: 'shopTypes' })

const ShopTypeModel = mongoose.model<ShopType>('shopTypes', schema);

export async function getAllTypes(): Promise<ShopType[]> {
    return ShopTypeModel.find();
}