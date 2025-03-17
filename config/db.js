import mongoose from "mongoose";
import dotevn from "dotenv";


dotevn.config();

export const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log("Đã kết nối Db");
    } catch (error) {
        console.log(error);
        process.exit(1); //kết nối fail
    }
}