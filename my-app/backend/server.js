// 🔥 DEBUG START
console.log("🔥 Server file started...");


const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { Chatting } = require("./bot");


const app = express();
const PORT = 5000;
const SECRET_KEY = "mysecretkey";

// Middleware
app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { email } = req.body;

  // Normally you'd verify user from DB
  const user = {
    id: 1,
    email: email,
  };

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    message: "Login successful ✅",
    token,
  });
});



// 🤖 CHATBOT ROUTE (FIXED & WORKING)
app.post("/api/chat", async (req, res) => {
  try {
    console.log("🤖 AI Chat API HIT");

    const { message } = req.body;

    const reply = await Chatting(message);

    res.json({
      reply,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      reply: "Error generating AI response",
    });
  }
});


// 🔗 MongoDB Connection
const MONGO_URI = "mongodb+srv://admin:Simar123@cluster0.mevqgww.mongodb.net/chatbotDB?retryWrites=true&w=majority";

console.log("🔄 Trying MongoDB connection...");

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed:");
    console.log(err.message);
  });


// 👤 User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);


// 🔍 Test route
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});


// 🔐 SIGNUP ROUTE
app.post("/api/signup", async (req, res) => {
  try {
    console.log("📥 Signup request:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("✅ User saved to MongoDB");

    res.json({ message: "Signup Successful ✅" });

  } catch (error) {
    console.log("❌ Signup Error:", error.message);
    res.status(500).json({ message: "Error signing up ❌" });
  }
});


// 🔐 LOGIN ROUTE
app.post("/login", async (req, res) => {
  try {
    console.log("📥 Login request:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password ❌" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful");

    res.json({
      message: "Login Successful ✅",
      token,
    });

  } catch (error) {
    console.log("❌ Login Error:", error.message);
    res.status(500).json({ message: "Error logging in ❌" });
  }
});


// 🛡 VERIFY TOKEN
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided ❌" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};


// 🔒 PROTECTED ROUTE
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to Dashboard 🔥",
    user: req.user,
  });
});


// 🚀 START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});