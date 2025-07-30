import {Router, Request, Response } from "express";
import {z} from "zod";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
import userMiddleware from "../middleware/user";
import redisClient from "../redis/redisClient";
import emailService from "../services/emailService"; // Assuming you have an email service set up

dotenv.config();

const router = Router();
const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables.");
}
  
const signupSchema = z.object({
    username: z.string().min(2, { message: "Name must have at least 2 characters" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(32, { message: "Password must not exceed 32 characters" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one digit" })
        .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@$!%*?&#)" })
});

router.post('/signup', async (req: Request, res: Response) => {
    const {username, password, email} = req.body;

    const check = signupSchema.safeParse({
        username, 
        password,
        email
    })

    if (!check.success) {
        const errors = check.error.issues.map(issue => issue.message).join(", ");
        res.status(400).json({ message: errors });
        return;
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    });

    if (existingUser)  {
        res.status(400).json({
            message: "username already exists",
        })
        return;
    }
    
    const existingEmail = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (existingEmail)  {
        res.status(400).json({
            message: "email already exists",
        })
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword,
            email: email
        }
    })

    res.status(201).json({message: "user signed up successfully"})
    // Send welcome email
    await emailService.sendWelcomeEmail(
                    user.email,
                    user.username,
                    user.id
                );
});


router.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        res.status(401).json({
            message: "the username does not exist, please signup"
        })
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
    }
    if (user) {
        const payload = { userId: user.id, username: user.username };
        
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
        
        res.json({
            token
        })
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
})


router.get('/profile', userMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const cachedUser = await redisClient.get(`user:${userId}`);

    if (cachedUser) {
        console.log("Fetching user from cache");
        return res.json(JSON.parse(cachedUser));
    }
    console.log("Fetching user from database");
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({ username: user.username, email: user.email });
})
export default router;