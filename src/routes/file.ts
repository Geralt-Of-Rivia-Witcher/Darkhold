import express from "express";
import * as file from "../controllers/file";

const router = express.Router();

router.post("/uploadFile", file.EncryptAndUploadFile);

export default router;
