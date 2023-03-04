# S3-UPLOAD-WRAPPER

An S3 wrapper that uploads files to your bucket and generates file URL for you.

## Installation

Installation is done using the
[`npm install` command](https://docs.npmjs.com/downloading-and-installing-packages-globally) and you should install it globally:

```bash
$ npm install s3-upload-wrapper
```

## Features

- Upload files to s3 bucket using aws sdk (v3)
- Generate random file name or keep the original one

## Usage

```typescript
import { uploadFiles } from 's3-upload-wrapper/lib';

uploadFiles requires two parameters, ConfigOptions to initialize aws sdk and files array from multer

Use as below:

let configOptions = {
    credentials: {
        access_key: 'bucket access key',
        secret_key: 'bucket secret key'
    };
    region: 'bucket region';
    bucketName: 'bucket name';
    returnOriginalNames: false; // Optional, default is false. if true, then uses original file names received from multer while uploading to bucket
}

const urls: string[] = await uploadFiles(configOptions, files); // files is Array<Express.Multer.File> from multer
console.log(urls[0]) // https://yourbucket.s3.region.amazonaws.com/filename
```
