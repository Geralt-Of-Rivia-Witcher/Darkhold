import { Request, Response } from "express";
import bcrypt from "bcrypt";

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
    } else {
      await userModel.create({
        userName: req.body.userName,
        password: await bcrypt.hash(req.body.password, saltRounds),
        masterKey: req.body.masterKey,
      });

      return res.status(200).json({
        message: "Signed up successfully",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};
