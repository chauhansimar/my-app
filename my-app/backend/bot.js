const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

console.log("API KEY:", process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const History = [];

async function Chatting(userMessage) {
  try {
    History.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",

      contents: History,

      config: {
        systemInstruction: `
You are Ship District AI Support Assistant.
Help users with:
- Creating shipments
- Scheduling pickups
- Printing shipping labels
- FedEx, UPS, USPS services
- Package dimensions and weight
- Address verification
Reply professionally and shortly.
give short replies(1-2 lines), be friendly, answer directly, answer in correct order, act like real support agent
guide users step-by-step if needed if user greets casually, respond casually,avoid long answers, For greetings,
 thank-you messages, or simple replies, respond naturally and conversationally without numbered formatting.
`,
      },
    });

    const botReply = response.text;

    History.push({
      role: "model",
      parts: [{ text: botReply }],
    });

    return botReply;

  } catch (error) {
    console.log(error);

    return "Error generating AI response.";
  }
}

module.exports = { Chatting };