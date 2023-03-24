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

router.post("/shareFile", authMiddleware.verify, file.shareFile);

router.post(
  "/removeAccessFromFile",
  authMiddleware.verify,
  file.removeAccessFromFile
);

export default router;
