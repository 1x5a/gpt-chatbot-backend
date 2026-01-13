app.get("/", (req, res) => {
  res.send("Lunar backend is running 🌙");
});

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message missing" });
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful, safe assistant like ChatGPT."
            },
            ...history,
            { role: "user", content: message }
          ],
          temperature: 0.7
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch {
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
