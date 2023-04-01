import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./src/routes/auth";
import fileRoutes from "./src/routes/file";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("[server]: Connected to MongoDB");
  })
  .catch((error) => {
    console.log({
      message: "[server]: Error connecting to MongoDB:",
      error: error,
    });
    process.exit(1);
  });

app.use("/api/", authRoutes);
app.use("/api/", fileRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.PORT}`
  );
});

app.get("/", (req, res) => {
  res.status(200).send("Pew Pew Pew 🔫🔫🔫");
});
