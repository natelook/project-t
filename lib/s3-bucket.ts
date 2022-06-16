/* eslint-disable */
import aws from 'aws-sdk';

aws.config.update({
  region: 'us-west-1',
  accessKeyId: process.env.NEXT_AWS_ACCESS_KEY!,
  secretAccessKey: process.env.NEXT_AWS_SECRET_KEY!,
  signatureVersion: 'v4',
});

const s3 = new aws.S3();

export default s3;
