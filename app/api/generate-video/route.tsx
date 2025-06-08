import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const {avatar_id, script,voice_id} = await req.json();
  if(!avatar_id) {
    return NextResponse.json('avatar id is missing');
  }
  if(!voice_id) {
    return NextResponse.json('voice id is missing');
  }
  if(!script) {
    return NextResponse.json('script id is missing');
  }
  const data = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: avatar_id,
          avatar_style: "normal"
        },
        voice: {
          type: "text",
          input_text: script,
          voice_id: voice_id,
          speed: 1.1
        }
      }
    ],
    dimension: {
      width: 1280,
      height: 720
    }
  };
  try{
    const result = await axios.post('https://api.heygen.com/v2/video/generate',data,{
      headers: {
        'X-Api-Key': process.env.HeyGen_Api_Token,
        'Content-Type':'application/json'
      }
    });
    return NextResponse.json(result?.data?.data.video_id);

  } catch(err) {
    console.log("Error in Generating the Video::::",err);
  }
}
