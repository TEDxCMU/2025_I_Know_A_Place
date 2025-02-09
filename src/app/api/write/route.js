import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json(); 
        console.log("Received Data:", body);

        const { name, selected, storyText, tags, latLong } = body;

        const client = new google.auth.JWT(
            "bestsummerprograms@bestcolleges.iam.gserviceaccount.com", 
            null, 
            "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLKexJP30xTjF9\n1r8/vAAsRg1HIOff8GtsYl2xi9WZhpm3w5fCgacetBWd77ugJO14Rzz3N6hk0fC5\nCQOSh+dA+/+CG/TTndqBSMYwU3nui6LHtWm/RKyKlFxVO48fntv3hv3F1JdHzmQL\nJrFp0hVYgg9uHf8bJw0VWFaI/BeXBqggyGWEGNOX/mw+YMjPnv5fXL5DOhTPEw4b\nUGRxIZh9dYsclzr5+t7ZnhOORc+EWwz9xwIpb8DB94jFoWMNEr4Dab7vFbMaBneb\nTlN7KCHyTyFvNQxOrnkS6ezGXYPDv13P6JdFCeZSNK2EnbX02w+jwrvSpW3CJyRW\nygOPpmuTAgMBAAECggEACCGaamgXG6UUiAPTTbq5iwwWtfUUMrtNoV3igBunpehk\nOJ2kck18Idd1UgfpS4SO2JSJVR+uJrLcXpuEwBWeZNRxKoTx7JJRz4DZJdABflGq\nZzHUlKor+bPsaiDjHpHeHe8SMxvKHj6ddHDNAv48inlSIscikbSjampJtFvamdnB\nEZDW58KS2cxJAb6F9EOjsDT8QxQm8d6NVGDWNLhQDD307VqVrniRBPAeWO+ndOjU\nP4zYj90S6a8EJ8aelq3DjTpCiJnkWPWTTwC0cEeSwLIRu8XcGwcCykQXhziwAyh9\n3fDDmfa8pwb78LiI3dlxDLJmR5ZNOeYa2JakWzUSKQKBgQDxwToN674ujLhpAurs\ntNYx4pRS94pHGBynP5lS05aJxEtaFhBFcC1B4pNiMQB6Lx8GtojaRu8xaa2u3lXD\nZjrsD+h+7pI5lwcoIBaanGLduX0EBOT3jCZi1ywwaGT6pQZQbOv2mPYgR6L+If7n\nS6ex2tCyeZnVTquxWJGs3pq5NwKBgQDXIpDubGNecb0A/BFD+EY3kU9y/+j+agG0\nKa4IYwgBflALB40Bu43VbNRNhB1gmW19zI19/qVgU4NaKvPx5dtopML09mtfd672\nBmQvECdydQ5jgZS0WApl8az4EQrce+FCohI91PAXEh6euYixWBEFiu1BqczCsQjL\n1lo16c5ehQKBgAIDnBo1lpYIshid35stPoOX4ah3S32gI8z46KwZ+y0Wp5IOkQAj\nGR1tZ9Dvm5NpBRcnOiinYqLEwJ+uVoSUO3VwBH3aOvmj2nlpGwcaunAidXotGEM/\ntaopJMMae4zjBxRwc97QE2zda+w2GEuRA8qliguSm8d9Kk0F8eDA0gUtAoGBAIi1\nkH/SJLspb7+mbppQtN4u2tvrP3YciwSfz9XIiJfaWqcHn1VQh+ruA2NW5wwxs2BT\nkj5UiWbS6w9raCV5uZmfybu8s7Kw7V+t5A/8JfUX6ZLWD1ci80ig8ReaTNqbZiPf\ntdPQ8tjWTNr0b6ayne51wBsP+exmb36Isj68WsW5AoGBAJYQNdrJBL8lgJpHCuZ7\n0yl7I5mlCATqFJnlCEqHvpTTjZH7RhIB2NQ9s980BNSYur50U60vXHwaFqEt/tDH\nOED5YanqMbXGONNDyhsfms4PCcZ3M3HkLEklDm7th9hYNBpflBb18rVvb/K15/uo\nonW/NNtQyYrGMl0Bi8DX6SXK\n-----END PRIVATE KEY-----\n",
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
        
        const spreadsheetId = process.env.NEXT_PUBLIC_SHEETS_ID; 

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
