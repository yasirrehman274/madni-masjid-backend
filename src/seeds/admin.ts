import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { User } from "../models/user";

async function seedAdmin() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: env.ADMIN_EMAIL });
    if (existing) {
      console.log(`Admin user "${env.ADMIN_EMAIL}" already exists. Skipping.`);
      await mongoose.disconnect();
      return;
    }

    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
    await User.create({
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      passwordHash,
      role: "admin",
      status: "active",
    });

    console.log(`Admin user created: ${env.ADMIN_EMAIL}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("Admin seed failed:", err);
    process.exit(1);
  }
}

seedAdmin();
