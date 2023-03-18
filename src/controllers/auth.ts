import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import userModel from "../models/users";

const saltRounds = 10;

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (await userModel.exists({ userName: req.body.userName })) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const encryptedMasterKey = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(req.body.masterKey)
    );

    await userModel.create({
      userName: req.body.userName,
      password: await bcrypt.hash(req.body.password, saltRounds),
      rsaPublicKey: publicKey,
      rsaPrivateKey: privateKey,
      encryptedMasterKey: encryptedMasterKey,
    });

    // const decryptedData = crypto.privateDecrypt(
    //   {
    //     key: user.rsaPrivateKey,
    //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //     oaepHash: "sha256",
    //   },
    //   user.encryptedMasterKey
    // );
    // console.log(decryptedData.toString());

    return res.status(200).json({
      message: "Signed up successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.findOne({ userName: req.body.userName });

    if (!user) {
      return res.status(404).json({
        message: "Username doesn't exist",
      });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    return res.status(200).cookie("auth_token", token).json({
      message: "Signed in successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};
