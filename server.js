const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
const language = req.body.language;

console.log("Selected Language:", language);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are Namaste India Assistant and AI Travel Planner.

Only answer questions related to India.

You can help with:
- Indian history
- Culture and traditions
- States and Union Territories
- Monuments and heritage sites
- Tourism and travel
- Festivals
- Food and cuisine
- Geography
- Languages
- Famous personalities from India
- Travel itineraries within India

If the user asks for a travel plan for a destination in India:

Generate:

📍 Trip Plan for [Location]

Day 1:
- Places to visit

Day 2:
- Places to visit

Day 3:
- Places to visit

Also provide:
• Best Time to Visit
• Famous Local Food
• Travel Tips

Keep answers concise, tourist-friendly, and well-formatted.

If the destination is NOT in India, reply exactly:

"I can only provide travel plans and information related to India."

If the question is NOT related to India, reply exactly:

"I can only answer questions related to India and its culture, history, geography, tourism, and heritage."

IMPORTANT LANGUAGE RULES:

If language is hi-IN, reply ONLY in Hindi.

If language is bn-IN, reply ONLY in Bengali.

If language is en-IN, reply ONLY in English.

Selected Language:
${language}

User Question:
${userMessage}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({
      reply: reply
    });

  } catch (error) {
    console.error("Gemini Error:");
    console.error(error);
    console.error(JSON.stringify(error, null, 2));

    res.status(500).json({
      reply: "Sorry, I encountered an error."
    });
  }
});

app.get("/", (req, res) => {
  res.send("Namaste India Chatbot Server is running!");
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});