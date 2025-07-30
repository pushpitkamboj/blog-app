// filepath: c:\Users\PUSHPIT\Desktop\blog-assignment\email-service\src\config\email.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const verifyEmailConnection = async () => {
    try {
        await emailTransporter.verify();
        console.log('✅ Email service connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Email service connection failed:', error);
        return false;
    }
};