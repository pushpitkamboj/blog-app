import { Request } from "express";
import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import userMiddleware from "../middleware/user";
import { z } from "zod";
import enhancedUpload from "../storage/index";
import redisClient from "../redisClient";


dotenv.config();
const router = Router();
const prisma = new PrismaClient();


router.post("/", userMiddleware, enhancedUpload.single('image'), async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const userId = (req as any).user.userId;
    const imageUrl = req.file ? (req.file as any).location : null;

    const postSchema = z.object({
        title: z.string().min(2, { message: "more than 2 characters are required for title" }),
        content: z.string().min(5, { message: "more than 5 characters are required" }),
    });

    const check = postSchema.safeParse({ title, content });
    if (!check.success) {
        const errors = check.error.issues.map(issue => issue.message).join(", ");
        res.status(400).json({ message: errors });
        return;
    }

    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                authorId: userId,
                imageUrl: imageUrl
            },
        });
        const postId = newPost.id;
        await redisClient.set(`post:${postId}`, JSON.stringify(newPost), 'EX', 300);
        await redisClient.del('allPosts'); // Invalidate cache for all posts
        await redisClient.del(`userPosts:${userId}`); // Invalidate cache for user's posts
        res.status(201).json(newPost);
    } catch (error: any) {
        console.error("Error creating post:", error);
        if (error.message === 'Only image files are allowed (JPEG, PNG, GIF, WebP)') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Error creating post", error });
        }
    }
})

router.get("/", async (req: Request, res: Response) => {
    const cachedKey = 'allPosts';

    try {
        const cachedPosts = await redisClient.get(cachedKey);

        if (cachedPosts) {
            console.log("Fetching posts from cache");
            res.status(200).json(JSON.parse(cachedPosts));
            return;
        }

        const posts = await prisma.post.findMany({
            select: {
                id : true,
                title: true,
                content: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        username: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log("Fetching posts from database");
        await redisClient.set(cachedKey, JSON.stringify(posts), 'EX', 300); // Cache for 5 minutes
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
})


router.get("/my-posts", userMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const myPostsCacheKey = `userPosts:${userId}`;

    try {
        const cachedPosts = await redisClient.get(myPostsCacheKey);
        if (cachedPosts) {
            return res.status(200).json(JSON.parse(cachedPosts));
        }

        const posts = await prisma.post.findMany({
            where: {
                authorId: userId
            },
            select: {
                id: true,
                title: true,
                content: true,
                imageUrl: true, 
                createdAt: true,
                updatedAt: true,
                authorId: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        await redisClient.set(myPostsCacheKey, JSON.stringify(posts), 'EX', 300);
        res.status(200).json(posts);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
})


router.get("/:id", async (req: Request, res: Response) => {
    const postId = req.params.id;
    const cachedPostKey = `post:${postId}`;
    


    if (!postId) {
        res.status(400).json({ message: "Post ID is required" });
        return;
    }
    if (typeof postId !== "string") {   
        res.status(400).json({ message: "Post ID must be a string" });
        return;
    }

    const cachedPost = await redisClient.get(cachedPostKey);
    try {
        if (cachedPost) {
            console.log("Fetching post from post cache");
            res.status(200).json(JSON.parse(cachedPost));
            return;
        }
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                id: true,
                title: true,
                content: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        await redisClient.set(cachedPostKey, JSON.stringify(post), 'EX', 300);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Error fetching post", error });
    }
})


router.put("/:id", userMiddleware, enhancedUpload.single('image'), async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const postId = req.params.id;
    const { title, content } = req.body;
    
    const imageUrl = req.file ? (req.file as any).location : undefined;

    if (!postId) {
        res.status(400).json({ message: "Post ID is required" });
        return;
    }
    if (typeof postId !== "string") {   
        res.status(400).json({ message: "Post ID must be a string" });
        return;
    }

    const postSchema = z.object({
        title: z.string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string"
        }).min(2, { message: "more than 2 characters are required for title" }),
        content: z.string({
            required_error: "Content is required",
            invalid_type_error: "Content must be a string"
        }).min(5, { message: "more than 5 characters are required" }),
    });

    const check = postSchema.safeParse({ title, content });
    if (!check.success) {
        const errors = check.error.issues.map(issue => issue.message).join(", ");
        res.status(400).json({ message: errors });
        return;
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.authorId !== userId) {
            res.status(403).json({ message: "Only the author can edit the post" });
            return;
        }

        const updateData = {
            title,
            content,
            ...(imageUrl ? { imageUrl } : {})
        };

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: updateData
        });
        await redisClient.set(`post:${updatedPost.id}`, JSON.stringify(updatedPost), 'EX', 300);
        await redisClient.del('allPosts'); // Invalidate cache for all posts
        await redisClient.del(`userPosts:${userId}`); // Invalidate cache for user's posts
        
        res.status(200).json({ 
            message: "Post updated successfully",
            post: updatedPost
        });
        
    } catch (error: any) {
        console.error("Error updating post:", error);
        if (error.message === 'Only image files are allowed (JPEG, PNG, GIF, WebP)') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Error updating post", error });
        }
    }
})


router.delete("/:id", userMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const postId = req.params.id;

    if (!postId) {
        res.status(400).json({ message: "Post ID is required" });
        return;
    }
    if (typeof postId !== "string") {   
        res.status(400).json({ message: "Post ID must be a string" });
        return;
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (post.authorId !== userId) {
            res.status(403).json({ message: "You don't have permission to delete this post" });
            return;
        }

        await prisma.post.delete({
            where: { id: postId }
        });
        await redisClient.del(`post:${postId}`); // Invalidate cache for the deleted post
        await redisClient.del('allPosts'); // Invalidate cache for all posts
        await redisClient.del(`userPosts:${userId}`); // Invalidate cache for user's posts
        await redisClient.del(`user:${userId}`); // Invalidate cache for user's profile
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error });
    }
})

export default router;