import { Document, Schema, ObjectId, model } from 'mongoose';
import Chunk from '../models/Chunk';

export interface File extends Document {
  name: string;
  size: number;
  chunks: Chunk[];
}

export const FileSchema = new Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  chunks: [{ type: Object, required: true, default: [] }],
});

const File = model<File>('File', FileSchema);
export default File;
