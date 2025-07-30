import Queue from 'bull';

export interface EmailJobData {
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

export const EMAIL_QUEUE_NAME = 'email-processing';

export const createEmailQueue = (redisConfig: any) => {
    return new Queue(EMAIL_QUEUE_NAME, {
        redis: redisConfig,
        defaultJobOptions: {
            removeOnComplete: 50,
            removeOnFail: 100,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            }
        }
    });
};