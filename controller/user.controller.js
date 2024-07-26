import User from "../modules/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//signin
export const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const isUser = await User.findOne({ email });

    if (isUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      throw new Error("Something went wrong while hashing the password");
    }

    const userData = new User({
      ...req.body,
      role: "GENERAL",
      password: hashedPassword,
    });

    await userData.save();

    res.status(201).json({
      data: userData,
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    let token;
    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
      };
      token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "3h", // 3 hour token
      });
    }

    res.cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "User logged in successfully",
      data: token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

//user detials
export const userDetails = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "user detials",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//logout user
export const Logout = async (req, res) => {
  try {
    res.clearCookie("token").json({
      success: true,
      message: "logged out successfully",
      data: [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//admin getall users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      users,
      message: "All users",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//admin update user
export const updateUser = async (req, res) => {
    try {
      const sessionUser = req.userId;
      const { userId, email, name, role } = req.body;
  
      // Validate input
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "User ID is required",
        });
      }
  
      // Find the session user
      const user = await User.findById(sessionUser);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: true,
          message: "Session user not found",
        });
      }
  
      // Check if session user is an admin
      if (user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          error: true,
          message: "Access denied",
        });
      }
  
      // Construct payload
      const payload = {};
      if (email) payload.email = email;
      if (name) payload.name = name;
      if (role) payload.role = role;
  
      // Check if there are fields to update
      if (Object.keys(payload).length === 0) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "No fields to update",
        });
      }
  
      // Find the user to be updated
      const userToUpdate = await User.findById(userId);
      if (!userToUpdate) {
        return res.status(404).json({
          success: false,
          error: true,
          message: "User to be updated not found",
        });
      }
  
      // Update the user
      const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true });
  
      res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({
        success: false,
        error: true,
        message: error.message,
      });
    }
  };
  