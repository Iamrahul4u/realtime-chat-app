import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export async function signup(req, res) {
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName) {
      return res
        .status(400)
        .json({ message: "Email and Full Name are required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        message:
          "Password is required and should be at least 6 characters long",
      });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });
    generateToken(res, user._id);
    return res.status(201).json({ data: user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(res, user._id);
    return res.status(200).json({ message: "Successful" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function logout(req, res) {
  res.cookie("jwt", "");
  return res.status(201).json({ message: "Logout successful" });
}

export async function check(req, res) {
  try {
    res.json(req.user);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
