import { S3Client } from '@aws-sdk/client-s3';
import env from './env.js';
import logger from '../utils/logger.js';

/**
 * s3.js — AWS S3 Client configuration.
 * Uses credentials and bucket from environment variables.
 */

let s3Client = null;

if (env.aws.accessKeyId && env.aws.secretAccessKey) {
    s3Client = new S3Client({
        region: env.aws.region,
        credentials: {
            accessKeyId: env.aws.accessKeyId,
            secretAccessKey: env.aws.secretAccessKey,
        },
    });
    logger.info(`✅ AWS S3 Client initialized (Region: ${env.aws.region}, Bucket: ${env.aws.bucket})`);
} else {
    logger.warn('⚠️ AWS S3 credentials are missing in environment variables');
}

export default s3Client;
