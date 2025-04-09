const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  const medicalPrompt = `[STRICT MEDICAL MODE] Respond ONLY if the query is about:
    - Symptoms
    - First aid
    - Diagnoses
    - Medication advice
    - Greetings
    Otherwise, reply: "I can only assist with medical queries.
    If the user greets you greet them back.
    Don't add this type of lines Heres a friendly and structured response to your query!"
    User query, just give me the response without this type of lines.
    Always respond in a friendly and professional manner and avoid using jargon, give a structured response divided into paragraphs, line gaps.
    Respond in strucutred format without markdown, just add line gaps between paragraphs. Add Emojis to make it more engaging, and maintain a fritndly tone. Don't add bullet points instead use numbered like 1, 2, 3. and add line gaps of one two lines between each para by using markdown.: "${prompt}"`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: medicalPrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    const aiResponse =
      response.data.choices[0]?.message?.content || "No response from AI";
    console.log("AI response:", aiResponse);

    res.json({
      user: "AI",
      message: aiResponse,
    });
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Medical service unavailable. Please try again later.",
    });
  }
};
