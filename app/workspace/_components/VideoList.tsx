'use client'

import { Button } from '@/components/ui/button';
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { LoaderCircle } from 'lucide-react';

function VideoList() {

  const[videoList,setVideoList] = useState<any>([]);
  const{userDetail}:any = useContext(UserDetailsContext);
  const convex = useConvex();

  useEffect(() => {
    userDetail && GetUserVideoList()
  },[userDetail])
  const GetUserVideoList = async() => {
    const result = await convex.query(api.videoData.GetUsersVideo,{
      uId: userDetail?._id
    });
    setVideoList(result);
  }
  return (
    <div>
      {videoList?.length == 0 ?
        <div className='flex flex-col items-center justify-center'>
          <Image src={'/ad.png'} alt='ads'
            width={300}
            height={300}
          />
          <h2 className='font-medium text-xl'> You don't have any video ads created! Create new one</h2>
          <Link href={'/workspace/create-ad'}>
            <Button className={'mt-4'}>+ Create New Video Ad</Button>
          </Link>
        </div> :

        <div className='flex gap-7 flex-wrap mt-10 '> 
           {videoList?.map((video:any,index : number) => (
            <div key={index} className='my-10 relative cursor-pointer'>
              <div className='absolute bottom-0 p-5 w-full bg-black rounded-b-lg'>
                <h2 className='text-white font-bold'>{video?.topic}</h2>
                <h2 className='text-white opacity-55 drop-shadow-md'>{moment(video?._creationTime).fromNow()}</h2>
              </div>
              <Image src={video?.assets[0]} alt={video?.topic}
                    width={300}
                    height={500}
                    className='w-[300px] h-[450px] object-cover rounded-xl'
              />
              
              
            </div>
    
           ))}
        </div>
      }

      
    </div>
  )
}

export default VideoList
