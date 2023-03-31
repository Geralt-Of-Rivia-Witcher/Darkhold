import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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

    let responseDataChunks: Buffer[] = [];

    response.Body?.once("error", (err: any) => reject(err));

    response.Body?.on("data", (chunk: Buffer) =>
      responseDataChunks.push(chunk)
    );

    response.Body?.once("end", () =>
      resolve(Buffer.concat(responseDataChunks))
    );
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
