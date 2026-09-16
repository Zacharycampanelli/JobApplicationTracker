import { NextFunction, Request, Response, RequestHandler } from "express";
import { ZodType } from "zod";

export const validateBody = (zodSchema: ZodType): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = zodSchema.safeParse(req.body);
    if (!parsed.success) {
      const error = parsed.error.issues[0];
      return error
        ? res.status(400).json({ error: error.message })
        : res.status(400).json({ error: "Invalid request body" });
    }

    req.body = parsed.data;
    next();
  };
};
