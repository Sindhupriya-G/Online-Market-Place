import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Like extends Document {
  likeId: string;
  userId: string;
  productId: string;
}

const LikeSchema: Schema = new Schema({
  likeId: { type: String, default: uuidv4, required: true, unique: true },
  userId: { type: String, required: true },
  productId: { type: String, required: true },
});

export default mongoose.model<Like>('Like', LikeSchema);
