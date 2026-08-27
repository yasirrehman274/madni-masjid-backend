import mongoose from "mongoose";
import { env } from "./env";

let connected = false;

export async function connectDatabase(): Promise<void> {
  if (connected) return;

  try {
    await mongoose.connect(env.MONGODB_URI);
    connected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
  console.log("MongoDB disconnected");
}

export function isConnected(): boolean {
  return connected && mongoose.connection.readyState === 1;
}
