import jwt from "jsonwebtoken";

export const generateToken = (userId: number, sessionVersion: number) => {
  return jwt.sign({ userId, sessionVersion }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
