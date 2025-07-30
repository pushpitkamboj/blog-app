import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user'; 
import userPost from './routes/blogs';
import swagger from './swagger/index';
import adminRouter from './routes/admin';

dotenv.config();

const port = process.env.PORT;

const app: Application = express();
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/auth", userRouter);
app.use("/posts", userPost);
app.use("/docs", swagger);
app.use("/admin", adminRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, welcome to demo api of blog app!');
});

app.use((err: any, req: Request, res: Response, next: any) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});