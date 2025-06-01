import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Video } from 'lucide-react'
import React from 'react'

function Script({videoData,onHandleInputChange}:{videoData: any,onHandleInputChange:any}) {
  return (
    <div className='p-5 shadow rounded-xl'>
      <h2 className='font-bold text-lg flex gap-2 items-center'>
        <Video className='p-2 bg-green-600 text-white h-10 w-10 rounded-md' />
        Videos Ads Script
      </h2>
      <hr className='my-3' />
      <div className=''>
        <label className='text-gray-500'>Video Project Topic</label>
        <Input className='text-lg' value={videoData?.topic ?? ""} readOnly />
      </div>
      <div className='mt-3'>
        <label className='text-gray-500'>Video Script</label>
        <Textarea onChange={(e) =>onHandleInputChange('script',e.target.value)} className='text-lg' value={videoData?.script??videoData?.scriptVariant[0]?.content} />
      </div>
      <div className='grid grid-cols-3 gap-3 mt-3'>
        {videoData?.scriptVariant?.map((script: any,index :any) => (
          <div key={index} 
            className={`p-3 border rounded-lg cursor-pointer ${
              (script?.content === videoData?.script ||
                (!videoData?.script && script?.content === videoData?.scriptVariant?.[0]?.content))
                ? 'border-primary bg-blue-100'
                : ''
            }`}

            onClick={() =>onHandleInputChange('script',script?.content)}
          
          >
            <h2 className='line-clamp-3'>{script?.content}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Script
