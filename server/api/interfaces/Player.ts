import mongoose, { Schema, Document } from 'mongoose';

export interface Player extends Document {
    _id: string;
    username: string;
    role: string;
    lastServer: string;
    money: number,
    stats: Array<Object>;
}

const schema: Schema = new Schema({
    _id: { type: String },
    username: { type: String, required: true },
    role: { type: String, required: true },
    lastServer: { type: String, required: true },
    money: { type: Number, required: true },
    stats: { type: Array, required: true }
}, { collection: 'players' })

const PlayerModel = mongoose.model<Player>('players', schema);

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
        role: 'USER',
        lastServer: 'undefined',
        money: 0,
        stats: []
    });
}

export async function getPlayerByUsername(username: string): Promise<Player | undefined> {
    try {
        const players = await PlayerModel.find({ username: username });
        if (players.length > 0) {
            return players[0];
        }
        return undefined;
    } catch {
        return undefined;
    }
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
    try {
        const players = await PlayerModel.find({ _id: id });
        if (players.length > 0) {
            return players[0];
        }
    return undefined;
    } catch {
        return undefined;
    }
}