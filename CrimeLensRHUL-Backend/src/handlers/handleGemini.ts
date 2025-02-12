// File: handleGemini.tsx
import { generateQuestionGemini, checkAnswerGemini } from "../gemini"; // Adjust path if necessary

interface GeminiRequest {
  action: "generate-question" | "check-answer";
  context?: string;
  studentAnswer?: string;
}

interface GeminiResponse {
  message?: string | null;
  error?: string;
}

export const handleGemini = async (req: any, res: any): Promise<void> => {
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);

  try {
    const { action = "", context = "", studentAnswer = "" } = req.body || {};

    if (!action) {
      res.status(400).json({ error: "Action is required" });
      return;
    }

    let response: GeminiResponse = {};

    switch (action) {
      case "generate-question":
        if (!context) {
          res
            .status(400)
            .json({ error: "Context is required for generating a question" });
          return;
        }
        const questionResponse = await generateQuestionGemini(context);
        // Access generated text via response.text()
        response.message =
          questionResponse.response.text() || "No response from API";
        break;

      case "check-answer":
        if (!studentAnswer || !context) {
          res.status(400).json({
            error:
              "Both studentAnswer and context are required for checking an answer",
          });
          return;
        }
        const checkResponse = await checkAnswerGemini(studentAnswer, context);
        response.message =
          checkResponse.response.text() || "No response from API";
        break;

      default:
        res.status(400).json({ error: "Invalid action" });
        return;
    }

    res.json(response);
  } catch (error: unknown) {
    console.error("Error in Gemini handler:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};
