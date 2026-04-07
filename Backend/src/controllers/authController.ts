import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
    try {const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    } 

    const existingUser = await prisma.user.findUnique({ where: { email } });
     
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }   
    
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            createdAt: true
        }, 
    });

    return res.status(201).json({ message: "User registered successfully", user });

} catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Failed to register user" });
}
    
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

       const isPasswordCorrect = await comparePassword(password, user.password);

       if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Invalid credentials" });
       }

       const token = generateToken(user.id);

       res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt
        }
       })
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ error: "Failed to login" });
    }
}
            
            
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};