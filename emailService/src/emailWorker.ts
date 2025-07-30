import Queue from 'bull';
import { emailTransporter } from './config/email';
import { emailTemplates } from './templates';

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

export const createEmailWorker = (redisConfig: any) => {
    const emailQueue = new Queue('email-processing', { redis: redisConfig });

    emailQueue.process('send-email', async (job) => {
        const { to, type, metadata } = job.data as EmailJobData;
        
        try {
            let emailContent;
            
            switch (type) {
                case 'welcome':
                    emailContent = emailTemplates.welcome(metadata?.username || 'User');
                    break;
                case 'post-created':
                    emailContent = emailTemplates.postCreated(
                        metadata?.username || 'User', 
                        job.data.subject.replace('Your Post Has Been Published Successfully!', ''),
                        metadata?.postId || ''
                    );
                    break;
                case 'post-updated':
                    emailContent = emailTemplates.postUpdated(
                        metadata?.username || 'User',
                        'Your Post',
                        metadata?.postId || ''
                    );
                    break;
                case 'password-reset':
                    emailContent = emailTemplates.passwordReset(
                        metadata?.username || 'User',
                        job.data.html // Reset link passed in html field
                    );
                    break;
                default:
                    emailContent = { subject: job.data.subject, html: job.data.html };
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: to,
                subject: emailContent.subject,
                html: emailContent.html
            };

            const result = await emailTransporter.sendMail(mailOptions);
            
            console.log(`✅ Email sent successfully to ${to}:`, result.messageId);
            return { 
                success: true, 
                messageId: result.messageId,
                type: type 
            };

        } catch (error) {
            console.error(`❌ Failed to send email to ${to}:`, error);
            throw error;
        }
    });

    // Handle job events
    emailQueue.on('completed', (job, result) => {
        console.log(`📧 Email job ${job.id} completed:`, result);
    });

    emailQueue.on('failed', (job, err) => {
        console.error(`💥 Email job ${job.id} failed:`, err.message);
    });

    emailQueue.on('waiting', (jobId) => {
        console.log(`⏳ Email job ${jobId} is waiting...`);
    });

    return emailQueue;
};