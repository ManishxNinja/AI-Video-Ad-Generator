import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";

// 🔁 Trigger the Inngest function via API route (used by frontend)
export async function POST(req: NextRequest) {
  const { video_id, video_record_id } = await req.json();


  await inngest.send({
    name: "create-avatar",
    data: {
      video_id,
      video_record_id,
    },
  });


  return NextResponse.json({
    message: "Event sent",
    video_id,
    video_record_id,
  });
}
