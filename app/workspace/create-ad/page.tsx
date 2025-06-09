'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import axios from "axios";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { Id } from '@/convex/_generated/dataModel'; // ✅ Import Id type
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function CreateAd() {
  const [userInput, setUserInput] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const CreateNewVideoData = useMutation(api.videoData.CreateVideoData);
  const context = useContext(UserDetailsContext);
  const router = useRouter();

  if (!context) {
    throw new Error("UserDetailsContext must be used within a Provider");
  }

  const { userDetail, setUserDetail } = context;

  const GenerateAIVideoScript = async () => {
    if (!userInput) {
      console.error("No topic entered.");
      return; // ✅ Prevent submission with no topic
    }

    if (!userDetail?._id) {
      console.error("User ID is missing.");
      return; // ✅ Ensure user is authenticated
    }
    console.log(userDetail._id);

    if(userDetail?.credits < 10) {
      toast('Please add more credits!');
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request to /api/generate-script");
      const result = await axios.post('/api/generate-script', {
        topic: userInput,
      });

      const JsonResult = JSON.parse(result.data.content);
      console.log("Script Variant from API:", JsonResult);

      const resp = await CreateNewVideoData({
        uid: userDetail._id as Id<"users">, // ✅ Cast to Convex ID
        topic: userInput,
        scriptVariant: JsonResult,
      });

      console.log("Created videoData ID:", resp);
      setLoading(false);
      router.push(`/workspace/create-ad/${resp}`) // ✅ Confirm success
    } catch (err) {
      setLoading(false);
      console.error("Some error occurred:", err); // ✅ Improve error visibility
    }

    
  };

  return (
    <div className='p-10 mt-32 flex flex-col items-center justify-center'>
      <div>
        <Image src={'/ad.png'} alt='icon' width={250} height={600} />
      </div>
      <h2 className='font-bold text-2xl text-center'>🎥 Create AI Video Ads in Just One Click!</h2>
      <p className='mt-2 text-lg text-gray-500'>
        🚀 Turn your ideas into stunning, scroll-stopping videos — instantly, effortlessly, and without editing skills!
      </p>
      <Input
        onChange={(e) => setUserInput(e.target.value)}
        placeholder='Enter the topic or product info'
        className='w-[500px] text-lg mt-5 p-5'
      />
      <Button
        disabled={loading}
        onClick={GenerateAIVideoScript}
        className='mt-2 w-[250px] font-semibold'
      >
        {loading ? <LoaderCircle className='animate-spin' /> : <Sparkles />} Generate
      </Button>
    </div>
  );
}

export default CreateAd;
