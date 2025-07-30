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

export interface QueueResponse {
    success: boolean;
    message: string;
    jobId?: string;
}

export const EMAIL_QUEUE_NAME = 'email-processing';