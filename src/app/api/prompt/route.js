import openai from "./openai"
import { NextResponse } from "next/server";

export async function POST(request) {

    const { story } = await request.json();

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: 'system',
                content:
                    `
                Generate five tags associated with the story provided. 
                These tags should describe the tone, themes, and emotions of a story. 
                Here is an example: 
                {
                    "tags": [
                    { "tag": "Miracle"},
                    { "tag": "Love"},
                    { "tag": "School" }
                    { "tag": "Magical" }
                    { "tag": "Triumphant" }
                    ],
                }

                If the story provided is inappropriate, return an array of length 1: 
                {
                    "tags": [
                        {"tag": ""}
                    ]
                }

                Do not put a comma at the end of the events or connections arrays. 
                Return the response in JSON format that can be parsed by JSON.parse().
                `
            },
            {
                role: 'user',
                content: story
            }
        ],
        store: true,
    });

    let event = response.choices[0].message.content;

    let startIndex = event.indexOf('{');
    let endIndex = event.lastIndexOf('}');
    event = event.substring(startIndex, endIndex + 1);

    // Parsing through returned JSON File
    const parsedEventsObject = JSON.parse(event);

    return NextResponse.json({ tags: parsedEventsObject.tags });
}
