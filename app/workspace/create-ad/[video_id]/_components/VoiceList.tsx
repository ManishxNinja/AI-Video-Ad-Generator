import axios from 'axios'
import {  Loader, Mic,  PlayCircleIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

function VoiceList({videoData,onHandleInputChange} : { videoData: any,onHandleInputChange: any}) {
  const[voiceList,setVoiceList] = useState<any>(null);
  const[playAudio,setPlayAudio] = useState<any>();
  const audioRef= useRef<any>(null);

  useEffect(() =>  {
    getVoiceList();
  },[]);

  const getVoiceList = async() => {
    try {
      const result = await axios.get('/api/get-voice-list');
      console.log('Voice List::::::',result?.data);
      setVoiceList(result?.data);
    } catch(err) {
      console.log("Error fetching of voice List on Frontend:::",err);
    }
  }
  useEffect(() => {
    if(audioRef?.current && playAudio) {
      audioRef?.current?.load();
      audioRef?.current?.play();
    }
  },[playAudio]);
  return (
    <div className='p-5 mt-5 shadow rounded-xl'>
      <h2 className='font-bold text-lg flex gap-2 items-center'>
        <Mic className='p-2 bg-purple-600 text-white h-10 w-10 rounded-md' />
        Select Voice
      </h2>
      <hr className='my-3' />
      <audio controls ref={audioRef} className='hidden'>
        <source  src={playAudio} type='audio/mp3' />
      </audio>
      <div>
        <label>
          Select Your Fav. Voice for video ad
        </label>
        <div className='grid grid-cols-4 gap-4 mt-3 h-[250px] overflow-auto'>
          {voiceList == null? <Loader className='animate-spin' />:voiceList?.slice(0,100).map((voice: any,index: number) => (
            <div className={`flex items-center gap-2 border rounded-md p-1 cursor-pointer ${voice?.voice_id == videoData?.voice?.voice_id && 'border-primary bg-blue-100 text-primary'}`} key={index} onClick={() => onHandleInputChange('voice',voice)}>
              <PlayCircleIcon className='text-purple-600' onClick={() => setPlayAudio(voice?.preview_audio)}/>
              <div>
                <h2>{voice.name}</h2>
                <h2 className='text-xs'>
                  {voice.language}({voice.gender})
                </h2>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default VoiceList
