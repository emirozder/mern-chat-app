import cloudinary from "../lib/cloudinary-config.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    // Get logged in user id from req.user (set in protectRoute middleware)
    const loggedUserId = req.user._id;
    // Find all users except the logged in user (ne = not equal) and select all fields except password
    const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password")

    res.status(200).json({ success: true, data: filteredUsers })
  } catch (error) {
    console.log("An error occurred while fetching users: ", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id // Get receiver id from params
    const senderId = req.user._id // Get sender id from req.user (set in protectRoute middleware)

    // Find messages by  senderId and receiverId or vice versa
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    })

    res.status(200).json({ success: true, data: messages })
  } catch (error) {
    console.log("An error occurred while fetching messages: ", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id // Get sender id from req.user (set in protectRoute middleware)
    const receiverId = req.params.id // Get receiver id from params
    const text = req.body.text // Get text from body
    const image = req.body.image // Get image from body

    let imageUrl
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })

    await message.save()

    // Emit the message event to the receiver user
    const receiverSocketId = getReceiverSocketId(receiverId)
    // Check if receiver is online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", message)
    }

    res.status(201).json({ success: true, data: message })
  } catch (error) {
    console.log("An error occurred while sending message: ", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}