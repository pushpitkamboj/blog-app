import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface AuthenticatedRequest extends Request {
    user?: {
        email: string;
        role?: string;
        id: string;
    };
}

const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        
        if (!ADMIN_EMAIL) {
            return res.status(500).json({ 
                success: false, 
                message: "Admin email not configured" 
            });
        }

        // For testing purposes - you might want to add proper auth later
        // For now, just check if the request has admin context
        const userEmail = req.user?.email || req.headers['x-admin-email']; // Temporary header check
        
        if (userEmail === ADMIN_EMAIL) {
            next();
        } else {
            res.status(403).json({ 
                success: false, 
                message: "Admin access required" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error 
        });
    }
};

export default adminMiddleware;