import mongoose from 'mongoose';
import GuildSettings from '../models/GuildSettings';

export interface Guild extends mongoose.Document {
  id: string;
  settings: GuildSettings;
}

export const GuildSchema = new mongoose.Schema({
  id: { type: String, required: true },
  settings: { type: Object, requied: true },
});

const Guild = mongoose.model<Guild>('Guild', GuildSchema);
export default Guild;
