export async function generateSuggestion(prompt: string) {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_HF_TOKEN_CLIENT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Suggest a funny anonymous post idea about ${prompt}`,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.9,   // creativity
          top_p: 0.95
        }
      }),
    });

    const data = await response.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    } else {
      return "🤖 Oops, I couldn't think of anything right now.";
    }
  } catch (error) {
    console.error("HuggingFace API error:", error);
    return "⚠️ Service temporarily unavailable. Try again!";
  }
}
