import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const bucketName = process.env.AWS_S3_BUCKET || 'pushpit-blog-assignment';

const getS3Url = (key: string) => {
  return `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
};

const s3Storage = multerS3({
  s3: s3Client,
  bucket: bucketName,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req: Request, file: Express.Multer.File, callback: any) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname);
    const key = `blog-covers/${Date.now()}-${uniqueSuffix}${extension}`;
    callback(null, key);
  },
  metadata: (req: Request, file: Express.Multer.File, callback: any) => {
    callback(null, { fieldName: file.fieldname });
  }
});

const imageUpload = (fieldName: string) => {
  const uploader = multer({
    storage: s3Storage,
    limits: {
      fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req: Request, file: Express.Multer.File, callback: any) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
      }
    }
  });
  
  return (req: Request, res: Response, next: NextFunction) => {
    uploader.single(fieldName)(req, res, (err: any) => {
      if (err) {
        console.error('Multer error:', err);
        if (err instanceof multer.MulterError) {
          console.error('MulterError details:', {
            code: err.code,
            field: err.field,
            message: err.message
          });
        }
        return next(err);
      }
      
      if (req.file) {
        if (!(req.file as any).location && (req.file as any).key) {
          (req.file as any).location = getS3Url((req.file as any).key);
        }
      }
      
      next();
    });
  };
};

export default {
  single: imageUpload
};