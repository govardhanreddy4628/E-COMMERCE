import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HF_TOKEN = process.env.HF_API_TOKEN;
const HF_MODEL = process.env.HF_MODEL || "gpt2" || "mistralai/Mixtral-8x7B-Instruct-v0.1"; // replace with chat model hosted on HF or an instruction-tuned model
const AI_PROVIDER = process.env.AI_PROVIDER || "huggingface";
const CHUNK_SIZE = Number(process.env.CHUNK_SIZE || 80);

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function chat(messages: ChatMessage[] | string, opts: { max_tokens?: number } = {}): Promise<string> {
    
    // Normalize
    let promptStr: string;
    if (typeof messages === "string") {
      promptStr = messages;
    } else {
      promptStr = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n") + "\nASSISTANT:";
    }

  if (AI_PROVIDER === "huggingface") {
    // Hugging Face Inference API generic text generation
    // NOTE: model choice matters: pick a HF model that supports longer completions or chat-style

    if (!HF_TOKEN) {
      // fallback simulation if no token
      return `Simulated HF reply to: ${promptStr.slice(0, 200)}`;
    }

    const resp = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { inputs: promptStr, parameters: { max_new_tokens: opts.max_tokens || 300 }},
      { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json"}}
    );
    const output =
      Array.isArray(resp.data) && resp.data[0]?.generated_text
        ? resp.data[0].generated_text
        : resp.data?.generated_text ?? JSON.stringify(resp.data);
    // try to strip the prompt echo:
    return String(output).replace(promptStr, "").trim();
  }

  // fallback for other providers (cohere/openai) - simple structure; replace with their SDKs
  throw new Error("AI provider not implemented");
}


/**
 * chatStream simulates streaming by chunking the final generated text and calling onChunk.
 * If you integrate a real provider with streaming (OpenAI SSE, etc.), replace this function.
 */
export async function chatStream(
  messages: ChatMessage[] | string,
  onChunk: (chunk: string) => Promise<void> | void,
  onDone?: (finalText: string) => Promise<void> | void
) {
  const final = await chat(messages);
  for (let i = 0; i < final.length; i += CHUNK_SIZE) {
    const chunk = final.slice(i, i + CHUNK_SIZE);
    await onChunk(chunk);
    // small pause to simulate streaming
    await new Promise(r => setTimeout(r, 60));
  }
  if (onDone) await onDone(final);
}


export async function embed(text: string[]) {
  if (AI_PROVIDER === "huggingface") {
    // HF doesn't have a generic public embedding endpoint for all models; you may use sentence-transformers via inference
    // Use a sentence-transformers model hosted on HF, e.g., sentence-transformers/all-MiniLM-L6-v2
    const model = "sentence-transformers/all-MiniLM-L6-v2";
    const resp = await axios.post(
      `https://api-inference.huggingface.co/pipeline/feature-extraction/${model}`,
      text,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return resp.data; // array of embeddings
  }
  throw new Error("AI provider not implemented for embeddings");
}
