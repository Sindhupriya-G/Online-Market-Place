import mongoose, { Schema, Document } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

export interface Admin extends Document {
  username: string;
  email: string;
  password: string;
  role:string
}

const adminSchema: Schema = new Schema({
  // _id:{ type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:{ type:String}

});

export default mongoose.model<Admin>('Admin', adminSchema);
