import mongoose from "mongoose";
import {config} from "dotenv";

config();

const MONGOURL:string = process.env.MONGO_URL!;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGOURL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
};

export default connectDB;
