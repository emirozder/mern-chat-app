import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary-config.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Check if all fields are filled
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    // Check if password is at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    if (newUser) {
      // generate jwt token
      // generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic
        }
      })
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" })
    }
  } catch (error) {
    console.log("An error occurred while signing up: ", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email })

    // Check if user exists
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }

    // generate jwt token
    generateToken(user._id, res)

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic
      }
    })
  } catch (error) {
    console.log("An error occurred while login: ", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export const logout = (req, res) => {
  try {
    // Clear the jwt cookie to logout
    res.cookie("jwt", "", {
      maxAge: 0
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    console.log("An error occurred while logout: ", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export const updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  try {
    if (!profilePic) {
      return res.status(400).json({ success: false, message: "Profile picture is required" })
    }

    // Upload profile picture to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    // Update user profile picture in database with the cloudinary url of the uploaded image
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    })
  } catch (error) {
    console.log("An error occurred while updating profile: ", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }

}

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "User is authenticated", data: req.user })
  } catch (error) {
    console.log("An error occurred while checking auth: ", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}