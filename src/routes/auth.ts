import express from "express";

import * as authController from "../controllers/auth";

const router = express.Router();

router.post("/signUp", authController.signUp);

export default router;
