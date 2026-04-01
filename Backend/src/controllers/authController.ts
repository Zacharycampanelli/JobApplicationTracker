import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
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
    
    const hashedPassword = await bcrypt.hash(password, 10);

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
