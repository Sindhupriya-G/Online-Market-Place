import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Favorite document
interface FavoriteDocument extends Document {
  userId: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId ;
}

// Define mongoose schema for the Favorite
const FavoriteSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
});

// Define Favorite model

export default  mongoose.model<FavoriteDocument>('Favorite', FavoriteSchema);

