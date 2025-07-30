import express from 'express';
import dotenv from 'dotenv';
import { verifyEmailConnection } from './config/email';
import { createEmailWorker } from './emailWorker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Redis configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'email-service',
        timestamp: new Date().toISOString()
    });
});

// Start the email worker
const startEmailService = async () => {
    try {
        // Verify email connection
        const emailConnected = await verifyEmailConnection();
        if (!emailConnected) {
            throw new Error('Email service connection failed');
        }

        // Start email worker
        const emailQueue = createEmailWorker(redisConfig);
        console.log('📧 Email worker started successfully');

        // Start HTTP server
        app.listen(PORT, () => {
            console.log(`🚀 Email service running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });

    } catch (error) {
        console.error('❌ Failed to start email service:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📧 Email service shutting down...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📧 Email service shutting down...');
    process.exit(0);
});

startEmailService();