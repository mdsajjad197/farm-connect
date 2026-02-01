import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Consumer from "../models/Consumer.js";
import Admin from "../models/Admin.js";
import { generateToken } from "../config/jwt.js";

/* ================= USER ================= */

export const userSignup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user._id, role: "USER" });

    res.json({ token, role: "USER", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= CONSUMER ================= */

export const consumerSignup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const consumer = await Consumer.create({
      ...req.body,
      password: hashedPassword
    });

    res.status(201).json({ message: "Consumer registered", consumer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const consumerLogin = async (req, res) => {
  try {
    const consumer = await Consumer.findOne({ email: req.body.email });
    if (!consumer)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(req.body.password, consumer.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ id: consumer._id, role: "CONSUMER" });

    res.json({ token, role: "CONSUMER", consumer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= ADMIN ================= */

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = generateToken({ role: "ADMIN" });

    res.json({ token, role: "ADMIN" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
