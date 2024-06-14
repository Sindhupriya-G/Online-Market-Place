import mongoose, { Schema,Document } from "mongoose";
// import { v4 as uuidv4 } from 'uuid';

interface loginI extends Document{
//   _id: string;
  username: string;
  password: string;
  token:string;
} 

const loginSchema = new Schema<loginI>(
  {
    // _id: { type: String, default: uuidv4 },
    username: String,
    password: { type: String, require: true },
    token:{type:String},
  },
  
);

export default mongoose.model("Login", loginSchema);