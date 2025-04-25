import mongoose, { Schema, Document } from 'mongoose';

export interface ShopItem extends Document {
    _id: string;
    name: LocalizationString;
    item: string;
    enchants: Enchant[];
    price: number;
    image: string;
    type: string;
    max: number;
}

export interface LocalizationString {
    en: string;
    ru: string;
}

export interface Enchant {
    name: string;
    level: number;
}

const schema: Schema = new Schema({
    _id: { type: String },
    name: { type: Object, required: true },
    item: { type: String, required: true },
    enchants: { type: Object, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    max: { type: Number, required: true }
}, { collection: 'shop' })

const ShopModel = mongoose.model<ShopItem>('shop', schema);

export async function getAllItems(): Promise<ShopItem[]> {
    return ShopModel.find();
}

export async function getServerItems(serverId: string): Promise<ShopItem[]> {
    return ShopModel.find({ server: serverId });
}