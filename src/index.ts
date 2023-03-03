import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigOptions } from './types';

export async function uploadFiles(config: ConfigOptions, files: Array<Express.Multer.File>) {
  let data: string[] = [];
  if (!files || !files.length) return Promise.resolve(data);

  const s3 = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.credentials.access_key,
      secretAccessKey: config.credentials.secret_key,
    },
  });

  let promiseArr = [],
    filenames = [];
  for (const file of files) {
    let filename = generateFileName(files[0].originalname, config.returnOriginalNames);
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
  return !returnOriginalNames
    ? `${Math.random().toString(36).substring(2, 7)}${new Date().getTime().toString()}`
    : name;
}
