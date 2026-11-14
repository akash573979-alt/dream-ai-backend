import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "20kb" }));

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Dream AI Backend is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, personality } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Invalid message" });
    }

    const response = await ai.responses.create({
      model: "gpt-4.1-mini",
      instructions: typeof personality === "string"
        ? personality.slice(0, 1000)
        : "You are a helpful AI assistant.",
      input: message.trim()
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "AI response unavailable" });
  }
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
