import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (
  data: Buffer,
  key: string
): Promise<object> => {
  const file = await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: data,
    })
  );

  return file;
};

export const downloadFromS3 = async (key: string): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      })
    );

    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];

    stream.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    stream.once("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.once("error", reject);
  });
};

export const deleteFromS3 = async (key: string) => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    })
  );
};
