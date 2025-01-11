import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getSidebarUsers,
  sendMessage,
} from "../controllers/message.middleware.js";

const router = express.Router();
router.get("/getSideUsers", protectRoute, getSidebarUsers);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
export default router;
