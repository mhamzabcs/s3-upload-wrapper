import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigOptions } from './types';

export async function uploadFiles(config: ConfigOptions, files: Express.Multer.File[]) {
  const data: string[] = [];
  if (!files || !files.length) return Promise.resolve(data);
  let s3: S3Client;
  if (!config.credentials) {
    if (!config.s3Client || !(config.s3Client instanceof S3Client)) {
      throw new Error('Must provide S3Client or Credentials to initialize one');
    }
    s3 = config.s3Client;
  } else {
    s3 = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.credentials.access_key,
        secretAccessKey: config.credentials.secret_key,
      },
    });
  }

  const promiseArr = [];
  const filenames = [];

  for (const file of files) {
    const filename = generateFileName(file.originalname, config.returnOriginalNames);
    filenames.push(filename);
    promiseArr.push(
      s3.send(
        new PutObjectCommand({
          Bucket: config.bucketName,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      ),
    );
  }

  const imageURLS = await Promise.all(promiseArr);
  for (let i = 0; i < imageURLS.length; i++) {
    data.push(`https://${config.bucketName}.s3.${config.region}.amazonaws.com/${filenames[i]}`);
  }
  return Promise.resolve(data);
}

function generateFileName(name: string, returnOriginalNames = false): string {
  let randomName = `${Math.random().toString(36).substring(2, 7)}${new Date().getTime().toString()}`;
  if (name.split('.').length > 1) randomName += `.${name.split('.').at(-1)}`;
  return !returnOriginalNames ? randomName : name;
}
