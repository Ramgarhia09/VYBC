const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id }, // ✅ include _id here
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};


// REGISTER
const registerUser = async (req, res, next) => {
  try {
    console.log("Register body:", req.body); // 🔍 debug

    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      res.status(400);
      throw new Error("Please fill all fields");
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name: fullName,
      email,
      password,
    });

    console.log("User created:", user); // 🔍 debug

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    next(error);
  }
};

// LOGIN
const loginUser = async (req, res, next) => {
  try {
    console.log("Login body:", req.body); // 🔍 debug

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    next(error);
  }
};

// LOGOUT
const logoutUser = async (req, res) => {
  console.log("Logout user:", req.user);
  res.json({ message: "User logged out successfully" });
};

// PROFILE
const getProfile = async (req, res, next) => {
  try {
    console.log("Profile user:", req.user);
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error.message);
    next(error);
  }
};

module.exports = { registerUser, loginUser, logoutUser, getProfile };
