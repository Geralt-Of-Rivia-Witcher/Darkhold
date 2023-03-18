import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import userModel from "../models/users";

interface jwtPayload {
  userId: string;
}

interface apiRequest extends Request {
  user: any;
}

export const verify = async (
  req: apiRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = jwt.verify(
      req.cookies.auth_token,
      process.env.JWT_SECRET!
    ) as jwtPayload;

    req.user = await userModel.findOne({ _id: token.userId });

    if (!req.user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: error.message,
      });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
};
