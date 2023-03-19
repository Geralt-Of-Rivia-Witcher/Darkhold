import express from "express";

import * as file from "../controllers/file";
import * as authMiddleware from "../middlewares/auth";

const router = express.Router();

router.post("/uploadFile", authMiddleware.verify, file.EncryptAndUploadFile);

router.get("/getFileList", authMiddleware.verify, file.getFileList);

router.get(
  "/downloadFile/:fileId",
  authMiddleware.verify,
  file.decryptAndDownloadFile
);

export default router;
