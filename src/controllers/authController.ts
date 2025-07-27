import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { sendEmail } from "../utils/sendEmail";
import { generateOTP } from "../utils/generateOTP";

// Temporary in-memory store (use Redis in production)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// ---------- Send OTP ----------
export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = generateOTP();
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min

  try {
    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// ---------- OTP Verification ----------
const verifyOtp = (email: string, inputOtp: string) => {
  const record = otpStore.get(email);
  if (!record) throw new Error("OTP not found");
  if (record.expiresAt < Date.now()) throw new Error("OTP expired");
  if (record.otp !== inputOtp) throw new Error("Invalid OTP");
  otpStore.delete(email); // Ensure one-time use
};

// ---------- Signup Controller ----------
export const signup = async (req: Request, res: Response) => {
  const { name, dob, email, otp } = req.body;

  try {
    verifyOtp(email, otp);

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({ name, dob, email });

    res.status(201).json({ message: "Signup successful" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ---------- Signin Controller ----------
export const signin = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    verifyOtp(email, otp);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure:true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Signin successful",
      user: {
        id: user._id,
        name: user.name,
        dob: user.dob,
        email: user.email,
        token: token
      },
    });
  
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.status(200).json({ message: "Logged out successfully" });
};