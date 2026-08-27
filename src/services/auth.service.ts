import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/user";
import { findByEmail, comparePassword } from "./user.service";

export async function login(email: string, password: string) {
  const user = await findByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid email or password");

  if (user.status === "inactive") throw new Error("Account is inactive");

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role, name: user.name },
    env.JWT_SECRET,
    { expiresIn: 7 * 24 * 60 * 60 }
  );

  const userObj = user.toObject();
  const { passwordHash: _, ...userWithoutPassword } = userObj;

  return { user: userWithoutPassword, token };
}

export async function getMe(userId: string) {
  return User.findById(userId).select("-passwordHash").lean();
}
