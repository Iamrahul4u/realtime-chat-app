import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(conn.connection.host);
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to database");
  }
}
