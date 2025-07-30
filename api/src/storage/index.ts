import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

// Configure S3 client for Cloudflare R2
const r2Client = new S3Client({
  region: 'auto', // R2 uses 'auto' as region
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || ''
  },
  forcePathStyle: true // Required for R2
});

const bucketName = process.env.R2_BUCKET_NAME || 'blog-images';

// Debug R2 configuration
console.log('R2 Configuration:', {
  endpoint: process.env.R2_ENDPOINT,
  bucketName: bucketName,
  hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
  publicUrl: process.env.R2_PUBLIC_URL
});

// Generate public URL for R2 objects
const getR2Url = (key: string) => {
  if (process.env.R2_PUBLIC_URL) {
    // Use custom domain if configured
    return `${process.env.R2_PUBLIC_URL}/${key}`;
  }
  // Use R2 public URL format
  return `${process.env.R2_ENDPOINT}/${bucketName}/${key}`;
};

const r2Storage = multerS3({
  s3: r2Client,
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
    storage: r2Storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
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
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          code: err.code,
          stack: err.stack,
          storageErrors: err.storageErrors
        });
        
        if (err instanceof multer.MulterError) {
          console.error('MulterError details:', {
            code: err.code,
            field: err.field,
            message: err.message
          });
        }
        
        // Send a more specific error response
        if (err.message && err.message.includes('ENOTFOUND')) {
          return res.status(500).json({
            message: 'Storage service connection failed. Please check server configuration.',
            error: 'STORAGE_CONNECTION_ERROR'
          });
        }
        
        return next(err);
      }
      
      if (req.file) {
        console.log('File uploaded successfully:', {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          key: (req.file as any).key,
          location: (req.file as any).location
        });
        
        // Generate public URL for the uploaded file
        if (!(req.file as any).location && (req.file as any).key) {
          (req.file as any).location = getR2Url((req.file as any).key);
          console.log('Generated R2 URL:', (req.file as any).location);
        }
      }
      
      next();
    });
  };
};

export default {
  single: imageUpload
};