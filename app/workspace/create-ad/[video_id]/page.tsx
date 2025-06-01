"use client"

import { api } from '@/convex/_generated/api';
import { Id } from "@/convex/_generated/dataModel";
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Script from './_components/script';
import UploadFiles from './_components/UploadFiles';
import AvatarList from './_components/AvatarList';
import VoiceList from './_components/VoiceList';


function CreateVideo() {
  const { video_id } = useParams();
  const convex = useConvex();
  
  const [videoData, setVideoData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!video_id) return;

      try {
        const result = await convex.query(api.videoData.GetVideoDataById, {
          vid: video_id as Id<'videoData'>
        });
        setVideoData(result);
        
      } catch (err) {
        console.error("Error in fetching the video details", err);
      }
    };

    fetchData();
    
  }, [convex, video_id]);

  const onHandleInputChange= (field: any,value: any) => {
    setVideoData((prev:any) =>({
      ...prev,
      [field]: value
    }))
  }
 
  return (
    <div>
      <h2 className='font-bold text-2xl'>Create Video Ad</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-8'>
        <div className='md:col-span-2'>
            <Script videoData={videoData} onHandleInputChange={onHandleInputChange} />
            <UploadFiles videoData={videoData} />
            <AvatarList videoData={videoData} onHandleInputChange={onHandleInputChange} />
            <VoiceList videoData={videoData} onHandleInputChange={onHandleInputChange} />
        </div>
        <div>
          Preview
        </div>

      </div>
    </div>
  );
}

export default CreateVideo;
