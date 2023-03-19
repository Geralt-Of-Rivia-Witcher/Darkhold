import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import crypto from "crypto";

import * as aesEncrpytion from "../functions/aesEncryption";
import * as AWS from "../functions/AWS";
import userModel from "../models/users";

export const EncryptAndUploadFile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const file = req.files?.file as fileUpload.UploadedFile;
  var chunkSize: number = Math.floor(file.size / 16);

  const buff = fs.readFileSync(file.tempFilePath);
  const md5Hash = crypto.createHash("md5").update(buff).digest("hex");

  if (chunkSize * 16 < file.size) {
    chunkSize++;
  }

  const decryptedMasterKey = crypto.privateDecrypt(
    {
      key: req.user.rsaPrivateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    req.user.encryptedMasterKey
  );

  const iv = "12345678901234567890123456789012";

  const keyHash: string = crypto
    .createHash("sha512")
    .update(decryptedMasterKey)
    .digest("hex");

  const ivHash: string = crypto.createHash("sha512").update(iv).digest("hex");

  const readStream = fs.createReadStream(file.tempFilePath, {
    highWaterMark: chunkSize,
  });

  var encryptedData: Buffer[] = [],
    start = 0;

  readStream.on("data", (chunk: Buffer) => {
    const aesKey: Buffer = crypto.scryptSync(
      keyHash.substring(start * 8, start * 8 + 8),
      "This is a salt",
      32
    );

    const aesIv: Buffer = crypto.scryptSync(
      ivHash.substring(start * 8, start * 8 + 8),
      "This is a salt",
      16
    );

    encryptedData.push(aesEncrpytion.encryptWithAES(chunk, aesKey, aesIv));
    start++;
  });

  readStream.on("end", async () => {
    const encryptedFile = Buffer.concat(encryptedData);

    const fileUrl = await AWS.uploadToS3(
      encryptedFile,
      `${req.user.userName}/${crypto.randomUUID()}`
    );

    await userModel.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $push: {
          files: {
            fileName: file.name,
            fileUrl: fileUrl,
            md5Hash: md5Hash,
          },
        },
      }
    );
  });

  return res.status(201).json({
    message: "File uploaded successfully",
  });
};

// var newData: Buffer[] = [];
// for (var i = 0; i < 16; i++) {
//   const aesKey: Buffer = crypto.scryptSync(
//     keyHash.substring(i * 8, i * 8 + 8),
//     "This is a salt",
//     32
//   );
//   const aesIv: Buffer = crypto.scryptSync(
//     ivHash.substring(i * 8, i * 8 + 8),
//     "This is a salt",
//     16
//   );
//   newData.push(aesEncrpytion.decryptWithAES(data[i], aesKey, aesIv));
// }
// fs.writeFileSync("New", Buffer.concat(encryptedData));
