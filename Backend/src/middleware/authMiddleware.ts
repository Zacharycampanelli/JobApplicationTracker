import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { fdatasync } from "node:fs";

interface JwtPayload {
    userId: number;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user = decodedToken;
    next();
    } catch (error) {
        console.error("Error protecting route:", error);
        return res.status(401).json({ error: "Not authorized, token failed" });
    }
}