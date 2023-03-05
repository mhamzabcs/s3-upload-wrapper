# S3-UPLOAD-WRAPPER

An S3 wrapper that uploads files to your bucket and generates file URL for you.

**Features**:

- Upload files to s3 bucket using aws sdk (v3)
- Generate random file name or keep the original one
- TypeScript support

## Installation

```bash
$ npm install s3-upload-wrapper
```

## Usage

### Example 1: Basic Usage

`uploadFiles` requires two parameters, `ConfigOptions` to initialize aws sdk and files array from `multer`

```typescript
import { uploadFiles } from 's3-upload-wrapper';
import { ConfigOptions } from 's3-upload-wrapper/lib/types';

let configOptions: ConfigOptions = {
  credentials: {
    access_key: 'bucket access key',
    secret_key: 'bucket secret key',
  },
  region: 'bucket region',
  bucketName: 'bucket name',
  returnOriginalNames: true, // Optional, default is false. if true, then uses original file names received from multer while uploading to bucket
};

const urls: string[] = await uploadFiles(configOptions, files); // files is Array<Express.Multer.File> from multer
console.log(urls[0]); // https://yourbucket.s3.region.amazonaws.com/filename
```

### Example 2: Providing your own S3 client

If you'd like to initialize your own s3 client, you can pass it to the `uploadFiles` function as part of `ConfigOptions` instead of `credentials`

```typescript
import { uploadFiles } from 's3-upload-wrapper';
import { S3Client } from '@aws-sdk/client-s3';

let s3: S3Client = new S3Client({
  region: 'bucket region',
  credentials: {
    accessKeyId: 'bucket access key',
    secretAccessKey: 'bucket secret key',
  },
});
let configOptions = {
  region: 'bucket region',
  bucketName: 'bucket name',
  s3Client: s3,
  returnOriginalNames: true, // Optional, default is false. if true, then uses original file names received from multer while uploading to bucket
};

const urls: string[] = await uploadFiles(configOptions, files); // files is Array<Express.Multer.File> from multer
console.log(urls[0]); // https://yourbucket.s3.region.amazonaws.com/filename
```

### Example 3: Basic Usage with JS

`uploadFiles` requires two parameters, `ConfigOptions` to initialize aws sdk and files array from `multer`

```javascript
const express = require('express');
const multer = require('multer');
const { uploadFiles } = require('s3-upload-wrapper');
const upload = multer();

const configOptions = {
  credentials: {
    access_key: 'bucket access key',
    secret_key: 'bucket secret key',
  },
  region: 'bucket region',
  bucketName: 'bucket name',
  returnOriginalNames: true,
};

app.post('/', upload.array('files'), async function (req, res, next) {
  const urls = await uploadFiles(configOptions, req.files);
  console.log(urls[0]); // https://yourbucket.s3.region.amazonaws.com/filename
});
```

### Example 4: Providing your own S3 client with JS

If you'd like to initialize your own s3 client, you can pass it to the `uploadFiles` function as part of `ConfigOptions` instead of `credentials`

```javascript
const express = require('express');
const multer = require('multer');
const { uploadFiles } = require('s3-upload-wrapper');
const { S3Client } = require('@aws-sdk/client-s3');
const upload = multer();

const s3 = new S3Client({
  region: 'bucket region',
  credentials: {
    accessKeyId: 'bucket access key',
    secretAccessKey: 'bucket secret key',
  },
});
const configOptions = {
  region: 'bucket region',
  bucketName: 'bucket name',
  s3Client: s3,
  returnOriginalNames: false,
};

app.post('/', upload.array('files'), async function (req, res, next) {
  const urls = await uploadFiles(configOptions, req.files);
  console.log(urls[0]); // https://yourbucket.s3.region.amazonaws.com/filename
});
```
