"use client";

import { api } from '@/convex/_generated/api';
import { Id } from "@/convex/_generated/dataModel";
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import Script from './_components/script';
import UploadFiles from './_components/UploadFiles';
import AvatarList from './_components/AvatarList';
import VoiceList from './_components/VoiceList';

import { Button } from '@/components/ui/button';
import { Loader, Sparkle } from 'lucide-react';

import ImageKit from 'imagekit';
import axios from 'axios';
// import { clearInterval } from 'timers';

function CreateVideo() {
  const { video_id } = useParams(); // fetch video_id from route
  const convex = useConvex();
  const updatedVideo = useMutation(api.videoData.updateInitialVideo);

  const [videoData, setVideoData] = useState<any>(null);
  const [isGenerateButtonClick, setIsGenerateButtonClick] = useState<boolean>(false);
  const [generatedVideoUrl,setGeneratedVideoUrl] = useState<string | null>(null);

  // Fetch video data once on mount (only when video_id changes)
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const result = await convex.query(api.videoData.GetVideoDataById, {
          vid: video_id as Id<'videoData'>
        });

        setVideoData(result);
      } catch (err) {
        console.error("Error fetching video details:", err);
      }
    };

    fetchData();
  }, [convex, video_id]);

  // Safely update fields in the videoData object
  const onHandleInputChange = (field: string, value: any) => {
    setVideoData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    console.log(videoData);
  };

  // Setup ImageKit instance
  const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!
  });

  // Generate video function – uploads files and updates the 'assets' field
  const GenerateVideo = async () => {
    const rawFiles = videoData?.rawFiles;

    if (!rawFiles || rawFiles.length === 0) {
      console.warn("No files to upload");
      
    }

    if (rawFiles.length > 0) {
      try {
        const uploadPromises = rawFiles.map((file: any) =>
          imageKit.upload({
            file,
            fileName: `${Date.now()}.png`,
            isPublished: true,
          })
        );

        const uploadedRefs = await Promise.all(uploadPromises);
        const uploadedFiles = uploadedRefs.map((ref) => ref.url);

        console.log("✅ Upload successful");

        // ✅ Use directly in mutation (don't rely on videoData.assets)
        await updatedVideo({
          id: video_id as Id<'videoData'>,
          script: videoData?.script ?? "",
          assets: uploadedFiles,
          avatar: videoData?.avatar ?? null,
          voice: videoData?.voice ?? null,
        });

      } catch (err) {
        console.error("Upload failed to the ImageKit Cloud or DB:", err);
      }
    }

    
    // try {
    //   const result = await axios.post('/api/generate-video',{
    //     avatar_id: videoData?.avatar.avatar_id,
    //     script: videoData?.script,
    //     voice_id: videoData?.voice.voice_id,
    //   });

    //   console.log(result.data);

    //   const myVideoId = result.data;
      
    //   console.log("video_id is this::::::::",myVideoId);

    // } catch(err) {
    //   console.log("error in fetching from backend::",err);
    // }

    // setIsGenerateButtonClick(true);
    // setGeneratedVideoUrl(null);
    

    try {
      // 🚀 Call API to trigger avatar generation event
      const response = await axios.post("/api/check-video-status", {
        video_id: "eb620c8eba034d23a2f20ca6a6dc19da",
        video_record_id: video_id,
      });

      console.log("Triggered Inngest event:", response.data);
    } catch (error) {
      console.error("Failed to trigger avatar creation:", error);
    }

  };

  // Show loading screen while data is being fetched
  if (!videoData) {
    return <Loader className="animate-spin flex items-center justify-center" />;
  }

  return (
    <div>
      <h2 className="font-bold text-2xl">Create Video Ad</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-8">
        <div className="md:col-span-2">
          {/* Each component receives current videoData and a setter function */}
          <Script videoData={videoData} onHandleInputChange={onHandleInputChange} />
          <UploadFiles videoData={videoData} onHandleInputChange={onHandleInputChange} />
          <AvatarList videoData={videoData} onHandleInputChange={onHandleInputChange} />
          <VoiceList videoData={videoData} onHandleInputChange={onHandleInputChange} />

          <Button onClick={GenerateVideo} className="mt-7 ml-2 mb-3 w-full">
            <Sparkle className="mr-2" /> Generate
          </Button>
        </div>

        {/* Right Column – reserved for Preview */}
        <div>
          <h3 className="text-lg font-semibold">Preview</h3>
          {/* Add preview logic here */}
        </div>
      </div>
    </div>
  );
}

export default CreateVideo;
