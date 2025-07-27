import express from "express";
import {
  sendOtp,
  signup,
  signin,
  logout,
} from "../controllers/authController";

const router = express.Router();

// POST /api/auth/send-otp
router.post("/send-otp", sendOtp);

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/signin
router.post("/signin", signin);

// logout 
router.post("/logout", logout);


export default router;
