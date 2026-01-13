const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ HOME ROUTE (fixes Cannot GET /)
app.get("/", (req, res) => {
  res.send("Lunar backend running 🌙");
});

// ✅ CHAT ROUTE
app.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
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
            { role: "system", content: "You are Lunar, a helpful and safe AI assistant." },
            ...history,
            { role: "user", content: message }
          ],
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "Lunar had no response."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lunar backend error" });
  }
});

// ✅ PORT FIX (important for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lunar backend running on port ${PORT}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lunar backend running on port ${PORT}`);
});
