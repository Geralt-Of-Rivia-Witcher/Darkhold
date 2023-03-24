import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import crypto from "crypto";

import * as aesEncrpytion from "../functions/aesEncryption";
import * as AWS from "../functions/AWS";
import fileModel from "../models/files";

export const EncryptAndUploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.files?.file as fileUpload.UploadedFile;
    var chunkSize: number = Math.floor(file.size / 16);

    const buff = fs.readFileSync(file.tempFilePath);
    const md5Hash = crypto.createHash("md5").update(buff).digest("hex");

    if (chunkSize * 16 < file.size) {
      chunkSize++;
    }

    const masterKey = crypto.randomBytes(32);

    const encryptedMasterKey = crypto.publicEncrypt(
      {
        key: process.env.RSA_PUBLIC_KEY!,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      masterKey
    );

    const keyHash: string = crypto
      .createHash("sha512")
      .update(masterKey)
      .digest("hex");

    const ivHash: string = crypto
      .createHash("sha512")
      .update(process.env.AES_IV!)
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

      await fileModel.create({
        encryptedMasterKey: encryptedMasterKey,
        fileName: file.name,
        fileKey: fileKey,
        md5Hash: md5Hash,
        chunkSize: Buffer.byteLength(encryptedData[0]),
        owner: req.user._id,
      });

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
    const files = await fileModel.aggregate([
      {
        $match: {
          $or: [{ owner: req.user._id }, { sharedWith: req.user._id }],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
      {
        $project: {
          _id: "$_id",
          fileName: "$fileName",
          owner: "$owner.userName",
        },
      },
    ]);

    return res.status(200).json({
      message: "File list fetched successfully",
      files: files,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const decryptAndDownloadFile = async (req: Request, res: Response) => {
  try {
    const requestedFile = await fileModel.findOne({
      _id: req.params.fileId,
    });

    if (!requestedFile) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (
      !requestedFile.owner.equals(req.user._id) &&
      !requestedFile.sharedWith.some((userIDs) => {
        return userIDs.equals(req.user._id);
      })
    ) {
      return res.status(403).json({
        message: "You are not authorized to download this file",
      });
    }

    const EncryptedFile = await AWS.downloadFromS3(requestedFile.fileKey);

    fs.writeFileSync(`${req.user.userName}-temp`, EncryptedFile);

    const readStream = fs.createReadStream(`${req.user.userName}-temp`, {
      highWaterMark: requestedFile.chunkSize,
    });

    const decryptedMasterKey = crypto.privateDecrypt(
      {
        key: process.env.RSA_PRIVATE_KEY!,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      requestedFile.encryptedMasterKey!
    );

    const keyHash: string = crypto
      .createHash("sha512")
      .update(decryptedMasterKey)
      .digest("hex");

    const ivHash: string = crypto
      .createHash("sha512")
      .update(process.env.AES_IV!)
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
      fs.writeFileSync(requestedFile.fileName, Buffer.concat(fileData));

      res.status(200).download(requestedFile.fileName, () => {
        fs.unlinkSync(`${req.user.userName}-temp`);
        fs.unlinkSync(`${requestedFile.fileName}`);
      });
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const shareFile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const requestedFile = await fileModel.findOne({
      _id: req.body.fileId,
    });

    if (!requestedFile) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (!requestedFile.owner.equals(req.user._id)) {
      return res.status(403).json({
        message: "Only the owner of the file can share it",
      });
    }

    if (!requestedFile.sharedWith.includes(req.body.shareWith)) {
      await fileModel.updateOne(
        {
          _id: req.body.fileId,
        },
        {
          $push: {
            sharedWith: req.body.shareWith,
          },
        }
      );
    }

    return res.status(200).json({
      message: "File shared successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};
