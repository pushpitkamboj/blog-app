import { Router, Request, Response } from "express";
import swaggerDoc from "./swagger.json";

const router = Router();

router.get("/", (req: Request, res: Response) => {  
    res.json(swaggerDoc);
});

export default router;