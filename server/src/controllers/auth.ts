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
    }

    const user = await userModel.create({
      userName: req.body.userName,
      password: await bcrypt.hash(req.body.password, saltRounds),
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    return res
      .status(201)
      .cookie("auth_token", token)
      .json({
        message: "Signed up successfully",
        data: {
          username: user.userName,
        },
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

    return res
      .status(200)
      .cookie("auth_token", token)
      .json({
        message: "Signed in successfully",
        data: {
          username: user.userName,
        },
      });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const signOut = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    return res
      .status(200)
      .clearCookie("auth_token")
      .clearCookie("username")
      .json({
        message: "Signed out successfully",
      });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const tokenStatusVerification = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token = jwt.verify(req.cookies.auth_token, process.env.JWT_SECRET!);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      message: "Authorized",
    });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: error.message,
      });
    }

    console.log(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
};
