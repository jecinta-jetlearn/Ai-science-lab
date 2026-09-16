import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Science QA Fallback database for young learners if API key is not configured
const KID_SCIENCE_FALLBACKS: Record<string, string> = {
  sky_blue: "Sunlight looks white, but it's made of all rainbow colors! Blue light scatters and bounces around the tiny air particles like bumper cars, painting our whole sky bright blue!",
  volcano_erupt: "Deep inside the Earth, hot melted rock (magma) traps lots of gas bubbles. When the pressure builds up, BAM! It rushes out the top just like shaking a fizzy soda bottle!",
  gravity: "Gravity is Earth's invisible superpower hug! It keeps our feet glued to the ground and makes apples fall down instead of floating away into space!",
  ice_float: "When water freezes into ice, the water droplets spread their arms wide and leave tiny airy gaps. That makes ice lighter than liquid water, so it bobs right to the top!",
  birds_fly: "Bird wings are shaped like airplane wings—curved on top and flat underneath! As air zooms over them, it pushes them UP into the sky, called lift!",
  rainbow: "Raindrops act like tiny glass prisms! When bright sunlight shines through falling rain, it splits into a happy parade of red, orange, yellow, green, blue, and purple!",
};

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Junior AI Science Lab" });
});

// API: Ask Professor Pip (AI Science Buddy for Kids)
app.post("/api/ask-pip", async (req, res) => {
  try {
    const { question, experimentContext } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Friendly fallback if API key is not yet set
      const lower = question.toLowerCase();
      let fallbackAnswer = "That is a brilliant wonder question! Everything in our universe has an awesome scientific secret. Try asking another question or tapping one of the lab experiments above!";
      if (lower.includes("sky") && lower.includes("blue")) fallbackAnswer = KID_SCIENCE_FALLBACKS.sky_blue;
      else if (lower.includes("volcano") || lower.includes("erupt")) fallbackAnswer = KID_SCIENCE_FALLBACKS.volcano_erupt;
      else if (lower.includes("gravity") || lower.includes("fall")) fallbackAnswer = KID_SCIENCE_FALLBACKS.gravity;
      else if (lower.includes("ice") && lower.includes("float")) fallbackAnswer = KID_SCIENCE_FALLBACKS.ice_float;
      else if (lower.includes("bird") || lower.includes("fly")) fallbackAnswer = KID_SCIENCE_FALLBACKS.birds_fly;
      else if (lower.includes("rainbow")) fallbackAnswer = KID_SCIENCE_FALLBACKS.rainbow;

      return res.json({
        answer: fallbackAnswer,
        source: "curated_kid_knowledge",
      });
    }

    const promptContext = experimentContext
      ? `The young learner is currently exploring the ${experimentContext} lab station. `
      : "";

    // Timeout protection for snappy responsiveness for young kids
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 8000)
    );

    const callPromise = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `${promptContext}A curious child asks: "${question}". Explain it to them!`,
      config: {
        systemInstruction: `You are Professor Pip, a warm, joyful, bubbly robot science friend for young kids aged 5 to 9. 
Rules:
1. Explain the scientific reason using simple, everyday analogies (like toy building blocks, playground slides, bath sponges, or juice boxes).
2. Keep explanations short: 2 to 4 friendly sentences maximum.
3. Absolutely NO dry academic jargon. If introducing a word like "friction" or "molecules", explain it instantly in 3 words (e.g., "tiny building blocks").
4. Keep the tone super enthusiastic, positive, and gentle! End with a high-five or fun wonder thought.`,
        temperature: 0.7,
      },
    });

    const response = await Promise.race([callPromise, timeoutPromise]);

    if (!response || !response.text) {
      const lower = question.toLowerCase();
      let fallbackAnswer = "You have such a curious scientific mind! Everything in nature is waiting to be explored! Try testing our lab stations above to see science in action!";
      if (lower.includes("sky") && lower.includes("blue")) fallbackAnswer = KID_SCIENCE_FALLBACKS.sky_blue;
      else if (lower.includes("volcano") || lower.includes("erupt")) fallbackAnswer = KID_SCIENCE_FALLBACKS.volcano_erupt;
      else if (lower.includes("gravity") || lower.includes("fall")) fallbackAnswer = KID_SCIENCE_FALLBACKS.gravity;
      else if (lower.includes("ice") && lower.includes("float")) fallbackAnswer = KID_SCIENCE_FALLBACKS.ice_float;
      else if (lower.includes("bird") || lower.includes("fly")) fallbackAnswer = KID_SCIENCE_FALLBACKS.birds_fly;
      else if (lower.includes("rainbow")) fallbackAnswer = KID_SCIENCE_FALLBACKS.rainbow;

      return res.json({ answer: fallbackAnswer, source: "curated_kid_knowledge" });
    }

    res.json({ answer: response.text, source: "gemini" });
  } catch (error: any) {
    console.error("Error in /api/ask-pip:", error);
    res.status(500).json({
      error: "Professor Pip's antennae got a little tickled! Try again in a moment.",
      fallback: "Scientists learn by trying again! Give the question another shot.",
    });
  }
});

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Junior AI Science Lab server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
