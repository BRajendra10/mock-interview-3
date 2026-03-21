import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB() {
    try {
        const connectionInstense = await mongoose.connect(`${process.env.MONGODB_URI}/mockdb`);
        
        console.log(`data base connected successfully ${connectionInstense}`);
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
}