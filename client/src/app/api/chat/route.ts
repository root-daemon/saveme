import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

// Define the schema for the transaction details we want to extract
const transactionSchema = z.object({
  toAddress: z
    .string()
    .describe(
      "The recipient Ethereum address (e.g., 0x...) or ENS name (e.g., vitalik.eth)"
    ),
  amount: z
    .string()
    .describe("The amount of cryptocurrency to send (as a string)"),
  symbol: z
    .string()
    .describe("The symbol of the cryptocurrency (e.g., ETH, USDC, USDT)"),
});

// Allow requests up to 30 seconds
export const maxDuration = 30;

// Initialize the Google Generative AI provider
const google = createGoogleGenerativeAI({
   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY, // Reads from env var by default
});

export async function POST(req: Request) {
  try {
    const { inputText } = await req.json();

    if (!inputText) {
      return new Response(JSON.stringify({ error: "Input text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { object: transactionDetails } = await generateObject({
      model: google("gemini-2.0-flash-exp"), 
      schema: transactionSchema,
      prompt: `Extract the transaction details from the following text: "${inputText}". Identify the recipient address (or ENS name), the amount, and the cryptocurrency symbol. Only return the extracted data in the specified format.`,
    });

    // Respond with the extracted object
    return new Response(JSON.stringify(transactionDetails), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    // Determine if it's an error we can safely send to the client
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An internal server error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
