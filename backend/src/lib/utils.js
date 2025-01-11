import jwt from "jsonwebtoken";
export const generateToken = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
