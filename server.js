// 🔥 DEBUG START
console.log("🔥 Server file started...");

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


const app = express();
const PORT = 5000;
const SECRET_KEY = "mysecretkey";

// Middleware
app.use(cors());
app.use(express.json());


// 🤖 CHATBOT ROUTE (FIXED & WORKING)
app.post("/api/chat", (req, res) => {
  console.log("CHAT API HIT ✅");

  const { message } = req.body;

  let reply = "";
  const msg = message.toLowerCase();

  /* 👋 GREETING */
  if (
    msg.includes("hello") ||
    msg.includes("hi") ||
    msg.includes("hey") ||
    msg.includes("good morning") ||
    msg.includes("good evening")
  ) {
    reply = "Hello! 👋 Welcome to Zoho. How can I assist you today?";
  }

  /* 💼 SERVICES / PRODUCTS */
  else if (
    msg.includes("service") ||
    msg.includes("what do you do") ||
    msg.includes("what services do you offer") ||
    msg.includes("what can you build") ||
    msg.includes("what do you provide") ||
    msg.includes("your work")
  ) {
    reply =
      "Zoho offers a comprehensive suite of cloud-based business applications including CRM, Finance (Books), HR (People), Email (Mail), and custom app development tools like Zoho Creator 🚀";
  }

  /* 🏢 COMPANY */
  else if (
    msg.includes("company") ||
    msg.includes("about") ||
    msg.includes("tell me about your company") ||
    msg.includes("who are you") ||
    msg.includes("about your company")
  ) {
    reply =
      "Zoho is a global technology company providing a unified cloud software suite designed to help businesses manage operations, improve productivity, and scale efficiently 🌐";
  }

  /* 📍 LOCATION */
  else if (
    msg.includes("location") ||
    msg.includes("where") ||
    msg.includes("where are you located") ||
    msg.includes("your office location") ||
    msg.includes("where is your company")
  ) {
    reply =
      "Zoho operates globally with offices in multiple countries and is headquartered in India 🇮🇳";
  }

  /* 👨‍💼 FOUNDER */
  else if (
    msg.includes("founder") ||
    msg.includes("owner") ||
    msg.includes("ceo") ||
    msg.includes("who is the founder") ||
    msg.includes("who started the company")
  ) {
    reply = "Zoho was founded by Sridhar Vembu 👨‍💼";
  }

  /* 👥 TEAM */
  else if (
    msg.includes("employee") ||
    msg.includes("team") ||
    msg.includes("how many employees") ||
    msg.includes("team size") ||
    msg.includes("how big is your team")
  ) {
    reply =
      "Zoho has over 10,000+ employees worldwide working across various domains 👥";
  }

  /* 📅 ESTABLISHED */
  else if (
    msg.includes("establish") ||
    msg.includes("founded") ||
    msg.includes("start") ||
    msg.includes("when was company established") ||
    msg.includes("when did you start") ||
    msg.includes("company age")
  ) {
    reply = "Zoho was founded in 1996 📅";
  }

  /* 🤖 AI */
  else if (
    msg.includes("ai") ||
    msg.includes("artificial intelligence") ||
    msg.includes("chatbot") ||
    msg.includes("automation")
  ) {
    reply =
      "Zoho provides AI-powered capabilities through Zia, its intelligent assistant that offers insights, automation, and predictions across its applications 🤖";
  }

  /* 📞 CONTACT */
  else if (
    msg.includes("contact") ||
    msg.includes("email") ||
    msg.includes("phone") ||
    msg.includes("how can i contact you") ||
    msg.includes("your email") ||
    msg.includes("phone number")
  ) {
    reply =
      "You can contact Zoho via email at sales@zohocorp.com or through their official website for support and inquiries 📧";
  }

  /* 💰 PRICING */
  else if (
    msg.includes("price") ||
    msg.includes("cost") ||
    msg.includes("how much") ||
    msg.includes("pricing") ||
    msg.includes("charges") ||
    msg.includes("project cost")
  ) {
    reply =
      "Zoho offers flexible pricing based on products and business needs, including free and subscription-based plans 💰";
  }

  /* 🌍 CLIENTS / USERS */
  else if (
    msg.includes("clients") ||
    msg.includes("customers") ||
    msg.includes("who do you work with")
  ) {
    reply =
      "Zoho serves millions of users worldwide, including startups, SMEs, and large enterprises across various industries 🌍";
  }

  /* 🔐 PRIVACY */
  else if (
    msg.includes("privacy") ||
    msg.includes("data") ||
    msg.includes("security")
  ) {
    reply =
      "Zoho prioritizes user privacy and does not rely on advertising-based revenue. Your data is secure and not sold to third parties 🔐";
  }

  /* ❌ DEFAULT */
  else {
    reply =
      "I'm not sure about that 🤔. You can ask about Zoho services, products, pricing, or company details!";
  }

  res.json({ reply });
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
app.post("/signup", async (req, res) => {
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