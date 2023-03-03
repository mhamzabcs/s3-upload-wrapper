export interface ConfigOptions {
  credentials: Credentials;
  region: string;
  bucketName: string;
  returnOriginalNames?: boolean;
}

interface Credentials {
  access_key: string;
  secret_key: string;
}
