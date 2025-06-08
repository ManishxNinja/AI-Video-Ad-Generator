import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import axios from "axios";
import { ConvexHttpClient } from "convex/browser";
import { inngest } from "./client";

export const CreateAvatar = inngest.createFunction(
  { id: "create-avatar" },
  { event: "create-avatar" },

  async ({ event, step }) => {
    const { video_id, video_record_id } = event.data;
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    console.log("Using HeyGen key:", process.env.HEYGEN_API_KEY);
    console.log("Polling video ID:", video_id);

    // ✅ Type-safely poll Heygen for video status with a max timeout
    const CreateAvatarId = await step.run("Poll for video status", async () => {
      const maxRetries = 60; // ⏱ Retry up to 5 minutes
      const pollInterval = 5000; // 5s

      for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await axios.get(
            `https://api.heygen.com/v1/video_status.get?video_id=${video_id}`,
            {
              headers: {
                Accept: "application/json",
                "X-Api-Key": process.env.HeyGen_Api_Token,
              },
            }
          );

          const status = response.data?.data.status;
          const videoUrl = response.data?.data?.video_url;

          console.log(`Poll #${i + 1} - Status: ${status}`);

          if (status === "completed") {
            return { status: "completed", videoUrl };
          }

          if (status === "failed") {
            return { status: "failed", error: "Video generation failed." };
          }

          // ⏳ Wait before the next retry
          await new Promise((res) => setTimeout(res, pollInterval));
        } catch (err) {
          console.error(`Error during poll #${i + 1}:`, err);
          throw new Error("Error polling video status.");
        }
      }

      throw new Error("Timeout: Video not completed within 5 minutes.");
    });

    //  Update DB only if the video is completed
    await step.run("UpdateToDb", async () => {
      if (
        CreateAvatarId.status === "completed" &&
        "videoUrl" in CreateAvatarId
      ) {
        const result = await convex.mutation(api.videoData.updateAvatarUrl, {
          vId: video_record_id as Id<"videoData">,
          videoUrl: CreateAvatarId.videoUrl,
          status : 1
        });
      } else {
        console.warn("Video not completed or failed. Skipping DB update.");
      }
    });

    return CreateAvatarId;
  }
);
