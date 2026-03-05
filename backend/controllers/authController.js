import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      password,
      confirmPassword,
      role,
      studentId,
    } = req.body;

    // Basic required fields
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Require studentId for student & organizer
    if (
      (role === "student" || role === "organizer") &&
      !studentId
    ) {
      return res
        .status(400)
        .json({ message: "Student ID is required for this role" });
    }

    // Check email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check duplicate studentId
    if (role === "student" || role === "organizer") {
      if (studentId) {
        const studentIdExists = await User.findOne({ studentId });
        if (studentIdExists) {
          return res.status(400).json({ message: "Student ID already exists" });
        }
      }
    }

    const userData = {
      firstName,
      lastName,
      phone,
      email,
      password,
      role,
    };

    if (role === "student" || role === "organizer") {
      userData.studentId = studentId;
    }

    const user = await User.create(userData);


    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error Details:", error);

    // Mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field === 'email' ? 'Email' : 'ID'} already exists`
      });
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error during registration",
      error: error.message
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error Details:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during login",
      error: error.message
    });
  }
};

//get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all organizers
export const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: "organizer" }).select("-password");

    res.status(200).json({
      success: true,
      count: organizers.length,
      organizers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//logout function
export const logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


