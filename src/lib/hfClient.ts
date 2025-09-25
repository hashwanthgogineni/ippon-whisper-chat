import axios from "axios";

const HF_API_URL = "https://api-inference.huggingface.co/models/gpt2";

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN_CLIENT;

export async function generatePost(prompt: string): Promise<string> {
  if (!HF_TOKEN) throw new Error("VITE_HF_TOKEN_CLIENT is not set.");
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data[0]?.generated_text || "🤖 Couldn't think of anything!";
    return text.replace(prompt, "").trim(); // clean result
  } catch (error) {
    console.error("HF API error:", error);
    return "⚠️ Error generating post.";
  }
}

export async function generateSuggestion(prompt: string): Promise<string> {
  if (!HF_TOKEN) throw new Error("VITE_HF_TOKEN_CLIENT is not set.");
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: `Suggest a funny anonymous post idea about ${prompt}`,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.9, // creativity
          top_p: 0.95
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data[0]?.generated_text || "🤖 Oops, I couldn't think of anything right now.";
  } catch (error) {
    console.error("HuggingFace API error:", error);
    return "⚠️ WhisperBot had a glitch. Try again!";
  }
}
