import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { tasks } = await req.json();

    const prompt = `
      You are an assistant that prioritizes tasks.
      Assign each task a priority: P1 (High), P2 (Medium), P3 (Low).
      Respond in **pure JSON array** format only, like:
      [
        { "id": "123", "newPriority": "P1" },
        { "id": "456", "newPriority": "P3" }
      ]

      Tasks:
      ${tasks.map((t: any) => `- ${t.id}: ${t.title} (Current: ${t.priority || "P3"})`).join("\n")}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let raw = response.choices[0].message.content || "[]";

    // Clean out any code fences
    raw = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse AI response:", raw);
      parsed = [];
    }

    return NextResponse.json({ results: parsed });
  } catch (err: any) {
    console.error("AI Prioritize Error:", err);
    return NextResponse.json(
      { error: "AI prioritization failed" },
      { status: 500 }
    );
  }
}
