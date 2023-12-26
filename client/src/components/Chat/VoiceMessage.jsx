import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { HOST } from "@/utils/ApiRoutes";

function VoiceMessage({message}) {
  const [{currentChatUser,userInfo}]=useStateProvider();
  const [audioMessage,SetAudioMessage]=useState(null);
  const [isPlaying,setIsPlaying]=useState(false);
  const [currentPlayBackTime,setCurrentPlayBackTime]=useState(0);
  const [totalDuration,setTotalDuration]=useState(0);
  const waveFormRef=useRef(null);
   const waveForm=useRef(null)
  const handlePlayAudio =()=>{
    if(audioMessage){
      waveForm.current.stop();
      waveForm.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
}
useEffect(()=>{
  if(waveForm.current===null){
    waveForm.current= WaveSurfer.create({
      container:waveFormRef.current,
      waveColor :"#ccc",
      progressColor:"#4a9eff",
      cursorColor:"#7ae3c3",
      barWidth:2,
      height:30,
      responsive:true,
  })
  waveForm.current.on("finish",()=>{
    setIsPlaying(false);
  })
}
  return ()=>{
    waveForm.current.destroy();
  }
},[])
useEffect(()=>{
  if(audioMessage){
    const updatePlaybackTime=()=>{
      setCurrentPlayBackTime(audioMessage.currentTime);
    }
    audioMessage.addEventListener("timeupdate",updatePlaybackTime);
    return ()=>{
      audioMessage.removeEventListener("timeupdate",updatePlaybackTime);
    }
  }
},[audioMessage]);
useEffect(()=>{
    const audioURL = `${HOST}/${message.message}`;
    const audio = new Audio(audioURL);
    SetAudioMessage(audio);
      waveForm.current.load(audioURL);
      waveForm.current.on("ready", () => {
        setTotalDuration(waveForm.current.getDuration());
      });
},[message.message])
const handlePauseAudio =()=>{
  waveForm.current.stop();
  audioMessage.pause();
  setIsPlaying(false);
}
const formatTime = (time) => {
  if (isNaN(time)) return "00:00"; 
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
  return <div className={`flex items-center gap-5 text-white px-4 py-4 rounded-md text-sm ${message.senderId===currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
      <div>
        <Avatar type="lg" image={currentChatUser.profilePicture}/>
      </div>
      <div className="cursor-pointer text-xl">
         {
          !isPlaying ? (<FaPlay onClick={handlePlayAudio}/>):
          (<FaStop onClick={handlePauseAudio}/>)
         }
      </div>
      <div className="relative">
        <div className="w-60 " ref={waveFormRef}/>
           <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
            <span>
              {formatTime(isPlaying?currentPlayBackTime:totalDuration)}
            </span>
            <div className="flex gap-1">
              <span>
                {
                  calculateTime(message.createdAt)
                }
              </span>
              {
                message.senderId===userInfo.id && <MessageStatus
                  messageStatus={message.messageStatus}
                />
              }
            </div>
           </div>
   
      </div>
  </div>;
}

export default VoiceMessage;
