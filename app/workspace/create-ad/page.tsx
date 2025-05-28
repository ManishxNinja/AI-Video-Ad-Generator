'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

function createAd() {
  const[userInput, setUserInput] = useState<string | undefined>();
  return (
    <div className='p-10 mt-32 flex flex-col items-center justify-center'>
      <div>
        <Image src={'/ad.png'} alt='icon' width={250} height={600} />
      </div>
      <h2 className='font-bold text-2xl text-center'>🎥 Create AI Video Ads in Just One Click!</h2>
      <p className='mt-2 text-lg text-gray-500'>🚀 Turn your ideas into stunning, scroll-stopping videos — instantly, effortlessly, and without editing skills!</p>
      <Input onChange={(e) => setUserInput(e.target.value)} placeholder='Enter the topic or product info' className={'w-[500px] text-lg mt-5 p-5'} />
      <Button className='mt-2 w-[250px] font-semibold'><Sparkles />Generate</Button>
    </div>
  )
}

export default createAd

