import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import crypto from "crypto";

import * as aesEncrpytion from "../functions/aesEncryption";

export const EncryptAndUploadFile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const file = req.files?.file as fileUpload.UploadedFile;
  var chunkSize: number = Math.floor(file.size / 16);

  if (chunkSize * 16 < file.size) {
    chunkSize++;
  }

  const masterKey = req.user.masterKey;
  const iv = "12345678901234567890123456789012";

  const keyHash: string = crypto
    .createHash("sha512")
    .update(masterKey)
    .digest("hex");

  const ivHash: string = crypto.createHash("sha512").update(iv).digest("hex");

  const readStream = fs.createReadStream(file.tempFilePath, {
    highWaterMark: chunkSize,
  });

  var data: Buffer[] = [],
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

    data.push(aesEncrpytion.encryptWithAES(chunk, aesKey, aesIv));
    start++;
  });

  readStream.on("end", () => {
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

    fs.writeFileSync("New" + file.name, Buffer.concat(data));
  });

  return res.send("DONE");
};
