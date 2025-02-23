import { google } from "googleapis";
import { NextResponse } from "next/server";
import credential from "@/app/api/gsapi-credentials.json"

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Received Data:", body);

        const { name, selected, storyText, tags, latLong } = body;

        const client = new google.auth.JWT(
            credential.client_email,
            null,
            credential.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        const gsapi = google.sheets({version:'v4', auth: client});

        // Use a Promise to handle client authorization
        await new Promise((resolve, reject) => {
            client.authorize((err) => {
                if (err) reject(err);
                resolve();
            });
        });

        const spreadsheetId = process.env.SPREADSHEET_ID;

        const rowOptions = {
            spreadsheetId,
            range: `Sheet1!A:F`, // Ensure correct column range
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [[name, selected, storyText, JSON.stringify(tags), JSON.stringify(latLong)]],
            },
        };

        await gsapi.spreadsheets.values.append(rowOptions);

        return NextResponse.json({ success: true, message: "Data received!" });
    } catch (error) {
        console.error("Error parsing request:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
