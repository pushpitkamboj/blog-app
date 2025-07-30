import Queue from 'bull';

interface EmailJobData {
    to: string;
    subject: string;
    html: string;
    type: 'welcome' | 'post-created' | 'post-updated' | 'password-reset';
    metadata?: {
        userId?: string;
        postId?: string;
        username?: string;
    };
}

class EmailService {
    private emailQueue: Queue.Queue;

    constructor() {
        this.emailQueue = new Queue('email-processing', {
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD
            }
        });
    }

    async sendWelcomeEmail(userEmail: string, username: string, userId: string) {
        return await this.emailQueue.add('send-email', {
            to: userEmail,
            type: 'welcome',
            subject: '', // Will be set by template
            html: '', // Will be set by template
            metadata: {
                username,
                userId
            }
        } as EmailJobData, {
            priority: 1,
            delay: 1000 // Send after 1 second
        });
    }

    async sendPostCreatedEmail(userEmail: string, username: string, postTitle: string, postId: string) {
        return await this.emailQueue.add('send-email', {
            to: userEmail,
            type: 'post-created',
            subject: postTitle, // Pass post title
            html: '', // Will be set by template
            metadata: {
                username,
                postId
            }
        } as EmailJobData, {
            priority: 2
        });
    }

    async sendPostUpdatedEmail(userEmail: string, username: string, postTitle: string, postId: string) {
        return await this.emailQueue.add('send-email', {
            to: userEmail,
            type: 'post-updated',
            subject: postTitle, // Pass post title
            html: '', // Will be set by template
            metadata: {
                username,
                postId
            }
        } as EmailJobData, {
            priority: 3
        });
    }

    async sendPasswordResetEmail(userEmail: string, username: string, resetLink: string) {
        return await this.emailQueue.add('send-email', {
            to: userEmail,
            type: 'password-reset',
            subject: '', // Will be set by template
            html: resetLink, // Pass reset link in html field
            metadata: {
                username
            }
        } as EmailJobData, {
            priority: 1,
            delay: 500
        });
    }

    // Get queue stats
    async getQueueStats() {
        const waiting = await this.emailQueue.getWaiting();
        const active = await this.emailQueue.getActive();
        const completed = await this.emailQueue.getCompleted();
        const failed = await this.emailQueue.getFailed();

        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length
        };
    }
}

export default new EmailService();
