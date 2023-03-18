import express from "express";
import * as file from "../controllers/file";

import * as authMiddleware from "../middlewares/auth";

const router = express.Router();

router.post("/uploadFile", authMiddleware.verify, file.EncryptAndUploadFile);

export default router;
