import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" })
    }

    // Find user by id
    const user = await User.findById(decoded.userId).select("-password") // userId is the key we used to sign the token in generateToken function
    if (!user) {
      return res.status(400).json({ success: false, message: "User Not Found" })
    }

    // Set user to req.user
    req.user = user

    // Call next function (controller)
    next()

  } catch (error) {
    console.log("An error occurred in protectRoute middleware: ", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}