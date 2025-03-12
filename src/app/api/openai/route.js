import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {

  try {
    const { input } = await req.json();
    
    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }
    
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI, // Ensure this is kept secure in environment variables
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            Generate three tags associated with the story provided. 
            Choose the three tags from this list: 
            1. Exciting
            2. Melancholic
            3. Suspenseful
            4. Stressful
            5. Enchanting
            6. Nostalgic
            7. Heartwarming
            8. Inspirational
            9. Triumphant
            10. Mysterious
            11. Ominous
            12. Funny
            13. Bittersweet
            14. Thrilling
            15. Somber
            16. Educational

            These tags should describe the tone, themes, and emotions of a story. 
            Here is an example: 
            {
                "tags": [
                { "tag": "Miracle"},
                { "tag": "Love"},
                { "tag": "Triumphant" }
                ]
            }

            If the story provided is not appropriate, return an array of length 1: 
            Check for obsecene language, assault, racist in nature.
            
            {
                "tags": [
                    {"tag": ""}
                ]
            }

            Return the response in JSON format that can be parsed by JSON.parse()
          `,
        },
        {
          role: "user",
          content: input,
        },
      ],
    });

    const rawContent = response.choices[0].message.content.trim(); 
    const jsonContent = rawContent.replace(/```json|```/g, "").trim(); // Remove markdown formatting

    return NextResponse.json(JSON.parse(jsonContent));
    

  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
