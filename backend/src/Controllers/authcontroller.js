const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000
};

const createToken = (user) => jwt.sign(
  { id: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

const getCredentials = (body = {}) => ({
  username: typeof body.username === "string" ? body.username.trim() : "",
  email: typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
  password: typeof body.password === "string" ? body.password : ""
});

const register = async (req, res) => {
  const { username, email, password } = getCredentials(req.body);
  const { profilePicture = "", bio = "" } = req.body || {};

  if (!username || !email || password.length < 8) {
    return res.status(400).json({
      message: "Username and email are required; password must be at least 8 characters"
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Authentication is not configured" });
  }

  const existingUser = await usermodel.findOne({
    $or: [{ email }, { username }]
  }).lean();

  if (existingUser) {
    return res.status(409).json({ message: "Username or email already exists" });
  }

  const newUser = await usermodel.create({
    username,
    email,
    password: await bcrypt.hash(password, 12),
    profilePicture,
    bio
  });

  res.cookie("token", createToken(newUser), cookieOptions);
  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      bio: newUser.bio
    }
  });
};

const login = async (req, res) => {
  const { username, email, password } = getCredentials(req.body);
  const identifier = email || username;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Username or email and password are required" });
  }

  const existingUser = await usermodel.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });

  if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Authentication is not configured" });
  }

  res.cookie("token", createToken(existingUser), cookieOptions);
  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      profilePicture: existingUser.profilePicture,
    }
  });
};

//api get me
async function getMe(req, res) {
  const userId = req.user.id;
  const user = await usermodel.findById(userId)
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ "Welcome": "Here is your information", user });
}

//logout
function logout(req, res) {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Logged out successfully" });
}


module.exports = { register, login, getMe, logout };  