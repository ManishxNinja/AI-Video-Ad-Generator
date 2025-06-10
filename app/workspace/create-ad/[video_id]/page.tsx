"use client";

import { api } from '@/convex/_generated/api';
import { Id } from "@/convex/_generated/dataModel";
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

import Script from './_components/script';
import UploadFiles from './_components/UploadFiles';
import AvatarList from './_components/AvatarList';
import VoiceList from './_components/VoiceList';

import { Button } from '@/components/ui/button';
import { Loader, LoaderCircle, Sparkle } from 'lucide-react';

import ImageKit from 'imagekit';
import axios from 'axios';
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
// import { clearInterval } from 'timers';

function CreateVideo() {
  const { video_id } = useParams(); // fetch video_id from route
  const convex = useConvex();
  const updatedVideo = useMutation(api.videoData.updateInitialVideo);
  const router = useRouter();

  const [videoData, setVideoData] = useState<any>(null);
  const context = useContext(UserDetailsContext);

  if (!context) {
    throw new Error("UserDetailsContext must be used within a Provider");
  }
  const {userDetail, setUserDetail } = context;

  const [isGenerateButtonClick, setIsGenerateButtonClick] = useState<boolean>(false);

  const UpdateUserCredits = useMutation(api.user.updateUserCredits);

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
    setIsGenerateButtonClick(true);
    const rawFiles = videoData?.rawFiles;

    if (!rawFiles || rawFiles == undefined || rawFiles.length === 0 || !videoData?.script || !videoData?.avatar || !videoData?.voice) {
      
      toast(<div className='text-red-600'>
        'Please Fill All The Details or wait for some Seconds and then try again'
      </div>)
      console.warn("No files to upload");
      setIsGenerateButtonClick(false);
      return;
    }

    if (rawFiles != undefined && rawFiles.length > 0) {
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
    let myVideoId = ''
    
    try {
      const result = await axios.post('/api/generate-video',{
        avatar_id: videoData?.avatar.avatar_id,
        script: videoData?.script,
        voice_id: videoData?.voice.voice_id,
      });

      console.log(result.data);

      myVideoId = result.data;
      
      console.log("video_id is this::::::::",myVideoId);

    } catch(err) {
      console.log("error in fetching from backend::",err);
      return;
    }

    

    try {
      // 🚀 Call API to trigger avatar generation event
      const response = await axios.post("/api/check-video-status", {
        video_id: myVideoId,
        video_record_id: video_id,
      });

      console.log("Triggered Inngest event:", response.data);
    } catch (error) {
      console.error("Failed to trigger avatar creation:", error);
    }
    setUserDetail((prev) =>
      prev
        ? {
            ...prev,
            credits: Number(userDetail?.credits! - 10),
          }
        : null
    );

    try {
      const result = await UpdateUserCredits({
        credits: Number(userDetail?.credits) - 10,
        uid:userDetail?._id!
      });
      console.log("Updated Credits:::",result);
    } catch(err) {
      console.log("Error in updating the credits",err);
    
    }
    setIsGenerateButtonClick(false);
    
  };

 
  if (!videoData) {
    return <Loader className="animate-spin flex items-center justify-center" />;
  }

  return (
    <div className='m-5'>
      <h2 className="font-bold text-3xl">Create Video Ad</h2>
      <div className="grid grid-cols-1 mt-2">
        <div className="">
          {/* Each component receives current videoData and a setter function */}
          <Script videoData={videoData} onHandleInputChange={onHandleInputChange} />
          <UploadFiles videoData={videoData} onHandleInputChange={onHandleInputChange} />
          <AvatarList videoData={videoData} onHandleInputChange={onHandleInputChange} />
          <VoiceList videoData={videoData} onHandleInputChange={onHandleInputChange} />

          <Button onClick={GenerateVideo} className={`mt-7 ml-2 mb-3 w-full${isGenerateButtonClick?'disabled':''}`}>
            {isGenerateButtonClick?<LoaderCircle className='mr-2 animate-spin' />:<Sparkle className={`mr-2`} />} Generate
          </Button>
        </div>

      </div>
    </div>
  );
}

export default CreateVideo;
