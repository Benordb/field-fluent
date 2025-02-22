import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateText(title: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Write a short script about ${title}. The script should be engaging and conversational.`,
        },
      ],
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("Failed to generate text");
  }
}
