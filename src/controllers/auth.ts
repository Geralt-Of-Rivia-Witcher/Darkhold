import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.status(200).cookie("auth_token", token).json({
      message: "Signed in successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};
