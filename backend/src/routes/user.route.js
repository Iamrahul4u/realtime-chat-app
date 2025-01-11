import express from "express";
import { uploadProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/uploadProfile", protectRoute, uploadProfile);

export default router;
