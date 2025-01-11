import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const uploadProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const imgUrl = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(req.user._id, {
      profilePic: imgUrl.url,
    });
    res.status(200).json({ message: "Profile picture uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
