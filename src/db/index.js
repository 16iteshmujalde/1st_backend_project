import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connetDb = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
}
export default connetDb