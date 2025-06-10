import { GENERATE_SCRIPT_PROMPT } from "@/services/Prompt";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";


const openai = new OpenAI({

    baseURL: "https://openrouter.ai/api/v1",

    apiKey: process.env.OPENROUTER_API_KEY,

  });

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = GENERATE_SCRIPT_PROMPT.replace('{topic}', topic);

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",

      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ content: completion.choices[0].message?.content });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}