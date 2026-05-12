import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  console.log("CHAT API HIT ✅");

  res.json({
    reply: "Chat is working ✅"
  });
});

export default router;