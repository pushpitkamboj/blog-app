import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

function userMiddleware(req: Request, res:Response, next: NextFunction) {

    // let authHeader: Request['headers']['authorization'];
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        res.json({
            message: "access denied, please login or signup to access this resource"
        })
        return;
    }

    const tokenParts = authHeader.split(" ");
    const jwtToken = tokenParts[1];    
    try { 
        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined in env");
        }
        
        const decoded = jwt.verify(jwtToken, SECRET_KEY) as JwtPayload;

        if (decoded && (decoded.userId)) {
            (req as any).user = decoded;
            next();
        } else {
            res.status(403).json({
                message: "Token verification failed: Missing required data",
            });
        }
        return;
    }
     catch (error) {
        // Handle invalid or expired tokens
         res.status(403).json({ error: "Invalid or expired token, please Login again" });
        return;
      }
}

export default userMiddleware;