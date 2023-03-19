import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadToS3 = async (
  data: Buffer,
  key: string
): Promise<string> => {
  const file = await s3
    .upload({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: data,
    })
    .promise();

  return file.Location;
};
