import { Router, Request, Response } from "express";
import emailService from '../services/emailService';
import adminMiddleware from '../middleware/admin';

const router = Router();

router.get("/queue-stats", adminMiddleware, async (req: Request, res: Response) => {
    try {
        const stats = await emailService.getQueueStats();
        res.json({
            message: "Email queue statistics",
            data : stats
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching queue stats", error });
    }
});

export default router;