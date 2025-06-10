import axios from 'axios'
import { Loader2Icon, User } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function AvatarList({ videoData,onHandleInputChange }: { videoData: any,onHandleInputChange: any }) {
  const [avatarList, setAvatarList] = useState<any[]>([])

  useEffect(() => {
    GetAvatarList()
  }, [])

  const GetAvatarList = async () => {
    try {
      const result = await axios.get('/api/get-avatar-list')
      console.log(result.data)
      setAvatarList(result.data)
    } catch (error) {
      console.error('Failed to fetch avatar list:', error)
    }
  }

  return (
    <div className='p-5 mt-5 shadow rounded-xl'>
      <h2 className='font-bold text-lg flex gap-2 items-center'>
        <User className='p-2 bg-red-600 text-white h-10 w-10 rounded-md' />
        Select Avatar
      </h2>
      <hr className='my-3' />
      <div>
        <label>Select Your Fav. Avatar for video ad</label>
        {avatarList.length == 0? <div className='w-full flex items-center justify-center'> <Loader2Icon className='animate-spin'/></div>:<div className='grid grid-cols-5 gap-4 mt-3 h-[250px] overflow-auto'>
          {avatarList.slice(0, 100).map((avatar: any, index: number) => (
            <div key={index} className={`border rounded p-2 hover:shadow-lg cursor-pointer ${videoData?.avatar?.avatar_id == avatar?.avatar_id && 'border-primary bg-blue-100'}`} onClick={() => onHandleInputChange('avatar',avatar)}>
              <Image
                src={avatar.preview_image_url}
                alt={avatar.avatar_id}
                width={100}
                height={100}
                className='rounded-lg bg-black'
              />
              <h2 className='text-center'>{avatar.avatar_name}</h2>
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
}

export default AvatarList
