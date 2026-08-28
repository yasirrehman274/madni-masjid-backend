import app from "../src/app";
import { connectDatabase } from "../src/config/database";

connectDatabase().catch((err) => {
  console.error("MongoDB connection failed on cold start:", err);
});

export default app;