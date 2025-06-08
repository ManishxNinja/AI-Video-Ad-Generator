import React from 'react'
import VideoList from './_components/VideoList'

function WorkSpace() {
  return (
    <div className='mt-5 ml-5'>
      <div>
        <h2 className='font-bold text-2xl text-red-400'>Explore and Create New Video Ads</h2>
        <p className='text-md font-semibold'>Start exploring new video ads and create on for you</p>
      </div>
      <VideoList />
    </div>
  )
}

export default WorkSpace
