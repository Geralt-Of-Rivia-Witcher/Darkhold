import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import crypto from "crypto";
import mongoose from "mongoose";

import * as aesEncrpytion from "../functions/aesEncryption";
import * as AWS from "../functions/AWS";
import userModel from "../models/users";

export const EncryptAndUploadFile = async (req: Request, res: Response) => {
  try {
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

    const keyHash: string = crypto
      .createHash("sha512")
      .update(decryptedMasterKey)
      .digest("hex");

    const ivHash: string = crypto
      .createHash("sha512")
      .update(process.env.AWS_IV!)
      .digest("hex");

    const readStream = fs.createReadStream(file.tempFilePath, {
      highWaterMark: chunkSize,
    });

    var encryptedData: Buffer[] = [],
      start = 0;

    readStream.on("data", (chunk: Buffer) => {
      const aesKey: Buffer = crypto.scryptSync(
        keyHash.substring(start * 8, start * 8 + 8),
        process.env.KDF_SALT!,
        32
      );

      const aesIv: Buffer = crypto.scryptSync(
        ivHash.substring(start * 8, start * 8 + 8),
        process.env.KDF_SALT!,
        16
      );

      encryptedData.push(aesEncrpytion.encryptWithAES(chunk, aesKey, aesIv));
      start++;
    });

    readStream.on("end", async () => {
      const encryptedFile = Buffer.concat(encryptedData);
      const fileKey = `${req.user.userName}/${crypto.randomUUID()}`;

      await AWS.uploadToS3(encryptedFile, fileKey);

      await userModel.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $push: {
            files: {
              fileName: file.name,
              fileKey: fileKey,
              md5Hash: md5Hash,
              chunkSize: Buffer.byteLength(encryptedData[0]),
            },
          },
        }
      );

      return res.status(201).json({
        message: "File uploaded successfully",
      });
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getFileList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const files = await userModel.aggregate([
      {
        $match: {
          _id: req.user._id,
        },
      },
      {
        $unwind: "$files",
      },
      {
        $project: {
          _id: "$files._id",
          fileName: "$files.fileName",
        },
      },
    ]);

    return res.status(200).json({
      files: files,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const decryptAndDownloadFile = async (req: Request, res: Response) => {
  try {
    const requestedFile = (
      await userModel.aggregate([
        {
          $match: {
            _id: req.user._id,
          },
        },
        {
          $unwind: "$files",
        },
        {
          $match: {
            "files._id": new mongoose.Types.ObjectId(req.params.fileId),
          },
        },
        {
          $project: {
            File: "$files",
          },
        },
      ])
    )[0];

    const EncryptedFile = await AWS.downloadFromS3(requestedFile.File.fileKey);

    fs.writeFileSync("temp", EncryptedFile);

    const readStream = fs.createReadStream("./temp", {
      highWaterMark: requestedFile.File.chunkSize,
    });

    const decryptedMasterKey = crypto.privateDecrypt(
      {
        key: req.user.rsaPrivateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      req.user.encryptedMasterKey
    );

    const keyHash: string = crypto
      .createHash("sha512")
      .update(decryptedMasterKey)
      .digest("hex");

    const ivHash: string = crypto
      .createHash("sha512")
      .update(process.env.AWS_IV!)
      .digest("hex");

    var fileData: Buffer[] = [],
      start = 0;

    readStream.on("data", (chunk: Buffer) => {
      const aesKey: Buffer = crypto.scryptSync(
        keyHash.substring(start * 8, start * 8 + 8),
        process.env.KDF_SALT!,
        32
      );

      const aesIv: Buffer = crypto.scryptSync(
        ivHash.substring(start * 8, start * 8 + 8),
        process.env.KDF_SALT!,
        16
      );

      fileData.push(aesEncrpytion.decryptWithAES(chunk, aesKey, aesIv));
      start++;
    });

    readStream.on("end", () => {
      fs.writeFileSync(requestedFile.File.fileName, Buffer.concat(fileData));

      res.status(200).download(requestedFile.File.fileName, () => {
        fs.unlinkSync("./temp");
        fs.unlinkSync(`${requestedFile.File.fileName}`);
      });
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};
