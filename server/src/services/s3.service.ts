import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, BUCKETS } from '../config/s3.js';

export class S3Service {
    // Upload buffer directly to public bucket (for avatar)
    async uploadAvatar(userId: string, buffer: Buffer, contentType: string) {
        const key = `avatars/${userId}`;
        await s3.send(new PutObjectCommand({
            Bucket: BUCKETS.public,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }));
        return key;
    }

    // Generate signed upload URL for private bucket (KYC)
    async getKycUploadUrl(userId: string, docType: string) {
        const key = `kyc/${userId}-${docType}.pdf`;
        const url = await getSignedUrl(s3, new PutObjectCommand({
            Bucket: BUCKETS.private,
            Key: key,
            ContentType: 'application/pdf',
        }), { expiresIn: 300 }); // 5 minutes
        return { url, key };
    }

    // Generate signed download URL for private bucket
    async getKycDownloadUrl(key: string) {
        const url = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: BUCKETS.private,
            Key: key,
        }), { expiresIn: 300 });
        return url;
    }
}