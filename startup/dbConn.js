import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
      useUnifiedTopology: false,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
