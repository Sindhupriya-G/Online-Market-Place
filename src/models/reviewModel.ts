/*import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Review extends Document {
  reviewId: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema({
  reviewId: { type: String, default: uuidv4},
  productId: { type: String,ref:'Product', required: true },
  userId: { type: String,ref:'User',required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
});

export default mongoose.model<Review>('Review', ReviewSchema);*/

import mongoose, { Schema, Document } from 'mongoose';

export interface Review extends Document {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  userName:string;
  date:Date;
}

const ReviewSchema:Schema= new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  userName:{ type:String,required:true},
  date:{ type:Date,default:Date.now}
});



export default mongoose.model<Review>('Review', ReviewSchema);
