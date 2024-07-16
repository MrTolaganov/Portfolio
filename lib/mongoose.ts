import { ConnectOptions, connect, set } from "mongoose";

let isConnected: boolean = false;

export const connectDatabase = async () => {
  set("strictQuery", true);
  if (!process.env.MONGO_URI) return console.error("MONGO URI is not defined");
  if (isConnected) return true;

  try {
    const options: ConnectOptions = { dbName: "portfolio", autoCreate: true };
    await connect(process.env.MONGO_URI!, options);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch {
    console.log("Error connecting database");
  }
};
