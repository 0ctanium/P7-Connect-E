import { FileUpload } from 'graphql-upload';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import SendData = ManagedUpload.SendData;
import { v4 as uuidv4 } from 'uuid';
import { s3 } from '../services/s3';

interface MediaUpload {
  bucket: SendData;
  file: FileUpload;
}

const Bucket = process.env.OWN_AWS_BUCKET_NAME;

export const uploadMedia = async (
  fileToUpload: Promise<FileUpload>,
  scope?: string
): Promise<MediaUpload> => {
  const file = await fileToUpload;

  const bucket = await new Promise<SendData>((resolve, reject) => {
    s3.upload(
      {
        Bucket,
        Key: scope ? `${scope}_${uuidv4()}` : uuidv4(),
        Body: file.createReadStream(),
      },
      (err: Error, data: SendData) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });

  return {
    bucket,
    file,
  };
};
