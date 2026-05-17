import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/generateToken";
import type { AuthRequest } from "../middleware/authMiddleware";

export const register = async (req: Request, res: Response) => {
    try {const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }
    
    if (name.trim().length < 2) {
        return res.status(400).json({ error: "Name must be at least 2 characters long" });
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
            name: name.trim(),
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }, 
    });

    const token = generateToken(user.id);

    return res.status(201).json({ message: "User registered successfully", user, token });

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
            name: user.name,
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
        name: true,
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
