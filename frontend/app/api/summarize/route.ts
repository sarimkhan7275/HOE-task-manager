import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      summary: response.choices[0].message.content,
    });
  } catch (err: any) {
    console.error("OpenAI Error:", err);
    return NextResponse.json(
      { error: "AI summarizer failed" },
      { status: 500 }
    );
  }
}
