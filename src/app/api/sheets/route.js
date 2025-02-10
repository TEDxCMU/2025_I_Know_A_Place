import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const client = new google.auth.JWT(
            process.env.NEXT_PUBLIC_EMAIL, 
            null, 
            process.env.NEXT_PUBLIC_KEY,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

            // Use a Promise to handle client authorization
            await new Promise((resolve, reject) => {
                client.authorize((err) => {
                    if (err) reject(err);
                    resolve();
                });
            });

            const gsapi = google.sheets({version:'v4', auth: client});

            const spreadsheetId = process.env.NEXT_PUBLIC_SHEETS_ID; 
            const sheetName = 'Sheet1';
            const startRow = 2; // First row to read
            const endRow = 300; // Last row to read (adjust based on your data)


            // Read the specified range
            const rowOptions = {
                spreadsheetId,
                range: `${sheetName}!${startRow}:${endRow}`, // Reads multiple rows
            };

            async function getPopulatedRows() {
                console.log("Fetching rows:", rowOptions.range);
                let response = await gsapi.spreadsheets.values.get(rowOptions);

                if (!response.data.values || response.data.values.length === 0) {
                    console.log("No data found.");
                    return [];
                }

                // Filter out empty values per row & remove fully empty rows
                const populatedRows = response.data.values
                    .map(row => row.filter(value => value.trim() !== "")) // Remove empty cells in a row
                    .filter(row => row.length > 0); // Remove completely empty rows

                console.log("Populated Rows:", populatedRows);
                return populatedRows;
            }

            const stories = await getPopulatedRows(); 



            return NextResponse.json({
                stories:{
                    stories
                }
            });

    } catch (e) {
        return NextResponse.json({ error: true, message: e.message }, { status: 500 });
    }
}