import { NextFunction, Request, Response } from "express";

export const csrfProtection = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return next();
    }

    const trustedOrigins = [
        process.env.FRONTEND_URL,
        ...(process.env.ADDITIONAL_TRUSTED_ORIGINS ?? "").split(",")
    ].map((origin) => origin?.trim()).filter(Boolean);

    const origin = req.get("Origin");

    if (!origin || !trustedOrigins.includes(origin)) {
        return res.status(403).json({ error: "Untrusted request origin" });
    }

    next();
}