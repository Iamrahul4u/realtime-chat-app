import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket.js";
import cloudinary from "../lib/cloudinary.js";
export async function getSidebarUsers(req, res) {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    return res.json(users);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

export async function getMessages(req, res) {
  try {
    const messages = await Message.find({
      $or: [
        { recieverId: req.user._id, senderId: req.params.id },
        { recieverId: req.params.id, senderId: req.user._id },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function sendMessage(req, res) {
  try {
    const { message, image } = req.body;
    let ImgUrl;
    if (image) {
      let url = await cloudinary.uploader.upload(image);
      ImgUrl = url.url;
    }
    const newMessage = new Message({
      recieverId: req.params.id,
      senderId: req.user._id,
      message: message ?? "",
      image: ImgUrl,
    });
    await newMessage.save();
    const socketId = getSocketId(req.params.id);
    if (socketId) {
      io.to(socketId).emit("message", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
