import crypto from "crypto";

export const encryptWithAES = (
  dataToEncrypt: Buffer,
  aesKey: Buffer,
  aesIv: Buffer
): Buffer => {
  var cipher = crypto.createCipheriv("aes-256-cbc", aesKey, aesIv);

  var encryptedData: Buffer = Buffer.concat([
    cipher.update(dataToEncrypt),
    cipher.final(),
  ]);

  return encryptedData;
};

export const decryptWithAES = (
  dataToDecrypt: Buffer,
  aesKey: Buffer,
  aesIv: Buffer
): Buffer => {
  var decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, aesIv);

  var decryptedData: Buffer = Buffer.concat([
    decipher.update(dataToDecrypt),
    decipher.final(),
  ]);

  return decryptedData;
};
