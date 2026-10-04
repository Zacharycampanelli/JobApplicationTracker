import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AUTH_COOKIE_NAME } from "../config/authCookie";

interface JwtPayload {
  userId: number;
  sessionVersion: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if(typeof token !== "string" || token.length === 0) {
      return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (
      !Number.isInteger(decodedToken.userId) ||
      decodedToken.userId <= 0 ||
      !Number.isInteger(decodedToken.sessionVersion) ||
      decodedToken.sessionVersion < 0
    ) {
      return res.status(401).json({ error: "Not authorized, invalid token payload" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        sessionVersion: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Not authorized, user not found" });
    }

    if (user.sessionVersion !== decodedToken.sessionVersion) {
      return res.status(401).json({ error: "Not authorized, session has expired" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error protecting route:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }

    res.status(500).json({ error: "Failed to Authenticate Request" });
  }
};
