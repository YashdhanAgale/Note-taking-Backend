import express from "express";
import {
  sendOtp,
  signup,
  signin,
  logout,
} from "../controllers/authController";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

export default router;
