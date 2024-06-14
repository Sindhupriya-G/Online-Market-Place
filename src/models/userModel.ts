import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role:string
}

const UserSchema: Schema = new Schema({
  // _id:{ type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:{ type:String, default:"user"}

});

export default mongoose.model<UserDocument>('User', UserSchema);
