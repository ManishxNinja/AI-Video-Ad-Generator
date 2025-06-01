import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await axios.get('https://api.heygen.com/v2/voices', {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': process.env.HeyGen_Api_Token
      }
    });

    return NextResponse.json(result?.data.data?.voices);

  } catch(err) {
    console.log("Some Error is coming in Fetching the Voices List::::",err);
  }
}