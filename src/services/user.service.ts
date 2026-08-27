import bcrypt from "bcryptjs";
import { User, IUser } from "../models/user";

const SALT_ROUNDS = 10;

export async function createUser(data: Partial<IUser> & { password?: string }) {
  const existing = await User.findOne({ email: data.email?.toLowerCase() });
  if (existing) throw new Error("Email already exists");

  const password = data.password ?? data.passwordHash ?? "";
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ ...data, passwordHash });
  const obj = user.toObject();
  const { passwordHash: _, ...rest } = obj;
  return rest;
}

export async function getUsers(pagination?: { page: number; limit: number; skip: number }) {
  if (pagination) {
    const { page, limit, skip } = pagination;
    const [data, total] = await Promise.all([
      User.find().select("-passwordHash").skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      User.countDocuments(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
  return User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();
}

export async function getUserById(id: string) {
  return User.findById(id).select("-passwordHash").lean();
}

export async function updateUser(id: string, data: Partial<IUser> & { password?: string }) {
  if (data.email) {
    const existing = await User.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } });
    if (existing) throw new Error("Email already exists");
    data.email = data.email.toLowerCase();
  }

  const updateData: Record<string, unknown> = { ...data };
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    delete updateData.password;
  }

  return User.findByIdAndUpdate(id, updateData, { new: true }).select("-passwordHash").lean();
}

export async function deleteUser(id: string) {
  return User.findByIdAndDelete(id);
}

export async function findByEmail(email: string) {
  return User.findOne({ email: email.toLowerCase() });
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
