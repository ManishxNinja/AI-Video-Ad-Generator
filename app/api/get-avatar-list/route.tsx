import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  try {
    const result = await axios.get('https://api.heygen.com/v2/avatars',{
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': process.env.HeyGen_Api_Token
      }
    });
    return NextResponse.json(result.data?.data.avatars);
  } catch(err) {
    console.log("Some error is coming ::::",err);
  }
}