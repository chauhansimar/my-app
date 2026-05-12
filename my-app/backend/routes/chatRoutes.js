const express = require("express");
const router = express.Router();

const Chat = require("../models/Chat");
const Conversation = require("../models/Conversation");

const { Chatting } = require("../bot");


// ✅ CREATE CONVERSATION
router.post("/conversation", async (req, res) => {

  try {

    const { userId } = req.body;

    const conversation = await Conversation.create({
      userId,
      title: "New Chat",
    });

    res.json(conversation);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error creating conversation",
    });
  }
});


// ✅ SEND MESSAGE
router.post("/chat", async (req, res) => {

  try {

    const { conversationId, message } = req.body;

    // SAVE USER MESSAGE
    await Chat.create({
      conversationId,
      sender: "user",
      message,
    });

    // GEMINI RESPONSE
    const botReply = await Chatting(message);

    // SAVE BOT MESSAGE
    await Chat.create({
      conversationId,
      sender: "bot",
      message: botReply,
    });

    res.json({
      reply: botReply,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Chat error",
    });
  }
});


// ✅ LOAD ALL MESSAGES
router.get("/messages/:conversationId", async (req, res) => {

  try {

    const messages = await Chat.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    console.log(error);
  }
});

module.exports = router;