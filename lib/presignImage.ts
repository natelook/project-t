import s3 from '@lib/s3-bucket';
import { v4 as uuidv4 } from 'uuid';

const presignImage = (fileType: string, folder: string) => {
  const { url, fields } = s3.createPresignedPost({
    Bucket: 'project-t.wtf',
    Fields: {
      key: `${folder}/${uuidv4()}.png`,
      'Content-Type': fileType,
      acl: 'public-read',
    },
    Expires: 60,
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });
  return { url, fields };
};

export default presignImage;
