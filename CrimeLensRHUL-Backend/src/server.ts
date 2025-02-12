import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import healthHandler from "./handlers/healthHandler";
import handleGetReports from "./handlers/handleGetReports";
import handlerDeleteReport from "./handlers/handleDeleteReport";
import handleCreateReport from "./handlers/handleCreateReport";
import handleUpload from "./handlers/handleUpload";
import handleAutocomplete from "./handlers/handleAutoComplete";
import handleGetTrees from "./handlers/handleGetTrees";
import CORS from "cors";
import handleCreateUserTree from "./handlers/handleCreateUserTree";
import handleGetVerifiedReports from "./handlers/handleGetVerifiedReports";
import handleGetUnverifiedReports from "./handlers/handleGetUnverifiedReports";
import handleGetMap from "./handlers/handleGetMap";
import LikeReport from "./handlers/handleLikeReport";

// Import Gemini SDK classes
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 23232;

const router = express.Router();
const corsInstance = CORS();

// Apply middleware
app.use(router);
app.use(corsInstance);
app.use(express.json());
router.use(express.json());
router.use(corsInstance);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
const systemPrompt =
  "You are Peter, an AI assistant dedicated to keeping people safe by providing awareness and assisting in reporting crimes. Your goal is to inform users about safety measures, answer questions related to crime prevention, and guide them on how to report incidents appropriately. You want to keep your messages fairly succinct, under 100 words where possible.";

// Maintain conversation history per user using an in-memory Map.
const conversationHistories: Map<string, string[]> = new Map();

router.get("/api/health", healthHandler);
router.get("/api/get-reports", handleGetReports);
router.get("/api/get-map", async (req: Request, res: Response) => {
  try {
    await handleGetMap(req, res);
  } catch (error) {
    console.error("Error in /api/get-map:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/api/create-report", handleCreateReport);
router.post("/api/upload", handleUpload);
router.get("/api/get-trees", handleGetTrees);
router.delete("/api/delete-report/:id", handlerDeleteReport);
router.get("/api/autocomplete", handleAutocomplete);
router.get("/api/get-verified-reports", handleGetVerifiedReports);
router.get("/api/get-unverified-reports", handleGetUnverifiedReports);
router.post("/api/like-report", LikeReport);

app.post("/peter", async (req: Request, res: Response) => {
  const { userId, message } = req.body;
  console.log("Received /peter request:", req.body);

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  // If the message contains "sos", immediately return an emergency response
  if (/sos/i.test(message)) {
    return res.json({
      reply:
        "ALERT: Help is coming; authorities have been notified. Ensure your safety first and avoid further danger.",
      isSOS: true,
    });
  }

  try {
    // Retrieve or initialize the user's conversation history.
    let history = conversationHistories.get(userId);
    if (!history) {
      history = [systemPrompt];
      conversationHistories.set(userId, history);
    }
    history.push(message);

    const response = await model.generateContent(history);
    const textResponse = response.response.text() || "No response from Gemini.";

    // Append the assistant's reply to the user's conversation history.
    history.push(textResponse);

    res.json({ reply: textResponse, isSOS: false });
  } catch (error: any) {
    console.error("Error in Gemini generateContent:", error.message);
    res.status(500).json({ error: "Failed to get response from Gemini." });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
