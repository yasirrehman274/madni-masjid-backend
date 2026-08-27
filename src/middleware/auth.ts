import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthenticatedRequest } from "../types";
import { User } from "../models/user";

export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string; role: string; name: string };

    const user = await User.findById(decoded.userId);
    if (!user || user.status !== "active") {
      res.status(401).json({ success: false, message: "User not found or inactive" });
      return;
    }

    req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role, name: decoded.name };
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Insufficient permissions" });
      return;
    }
    next();
  };
}
