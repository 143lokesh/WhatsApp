import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import axios from "axios";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";

function CaptureAudio({hide}) {
  const [{userInfo,currentChatUser,socket},dispatch]=useStateProvider();
  const [isRecording , setIsRecording]=useState(false);
  const [recorderedAudio,setRecorderedAudio]=useState(null);
  const [waveForm,setWaveForm]=useState(null);
  const [recordingDuration,setRecordingDuration]=useState(0);
  const [currentPlayBackTime,setCurrentPlayBackTime]=useState(0);
  const [totalDuration,setTotalDuration]=useState(0);
  const [isPlaying,setIsPlaying]=useState(false);
  const [renderedAudio , setRenderedAudio]=useState(null);
  const audioRef=useRef();
  const mediaRecorderRef=useRef();
  const waveFormRef=useRef();
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00"; 
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  useEffect(()=>{
    let interval;
    if(isRecording){
      interval= setInterval(()=>{
        setRecordingDuration((prevDuration)=>{
          setTotalDuration(prevDuration+1);
          return prevDuration+1;
        })
      },1000);
    }
    return ()=>{
      clearInterval(interval);
    }
  },[isRecording]);
  const handlePlayRecording =()=>{
        if(recorderedAudio){
          waveForm.stop();
          waveForm.play();
          recorderedAudio.play();
          setIsPlaying(true);
        }
  }
  useEffect(()=>{
    if(recorderedAudio){
      const updatePlaybackTime=()=>{
        setCurrentPlayBackTime(recorderedAudio.currentTime);
      }
      recorderedAudio.addEventListener("timeupdate",updatePlaybackTime);
      return ()=>{
        recorderedAudio.removeEventListener("timeupdate",updatePlaybackTime);
      }
    }
  },[recorderedAudio]);
  const handleStopRecording =()=>{
      if(mediaRecorderRef.current && isRecording){
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        waveForm.stop();
        const audioChunks=[];
        mediaRecorderRef.current.addEventListener("dataavailable",(event)=>{
          audioChunks.push(event.data);
        })
        mediaRecorderRef.current.addEventListener("stop",()=>{
          const audioBlob= new Blob(audioChunks,{type:"audio/mp3"});
          const audiofile= new File([audioBlob],"recording.mp3");
          setRenderedAudio(audiofile);
        })
      }
  }
  const handleStartRecording =()=>{
       setRecordingDuration(0);
       setCurrentPlayBackTime(0);
       setTotalDuration(0);
       setIsRecording(true);
       setRecorderedAudio(null);
       navigator.mediaDevices.getUserMedia({audio:true})
       .then((stream)=>{
        const mediaRecorder= new MediaRecorder(stream);
        mediaRecorderRef.current=mediaRecorder;
        audioRef.current.srcObject=stream;

        const chunks=[];
        mediaRecorder.ondataavailable=(e)=>chunks.push(e.data);
        mediaRecorder.onstop=()=>{
          const blob = new Blob(chunks,{
            type:"audio/ogg; codecs=opus"
          })
          const audioURL = URL.createObjectURL(blob);
          const audio= new Audio(audioURL);
          setRecorderedAudio(audio);
          waveForm.load(audioURL)
        }
        mediaRecorder.start();
       })
       .catch((err)=>{
        console.log(err);
       })
  }
  const handlePauseRecording =()=>{
       waveForm.stop();
       recorderedAudio.pause();
       setIsPlaying(false);
  }
  const sendRecording = async()=>{
    try{
      const  formData = new FormData();
      formData.append("audio",renderedAudio);
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE,formData,{
        headers : {
           "Content-Type":"multipart/form-data",
        },
        params:{
           from:userInfo.id,
           to:currentChatUser.id,
        }},)
        if(response.status===201){
          socket.current.emit("send-msg",{
            message:response.data.message,
            from: userInfo?.id,
            to:currentChatUser?.id,
          })
          dispatch({
              type:reducerCases.ADD_MESSAGE,
              newMessage:{
                ...response.data.message
              }
              ,
              fromSelf:true,
          })
        }
    }
    catch(err){
      console.log(err);
    }
  }
  useEffect(()=>{
      const wavesurfer= WaveSurfer.create({
          container:waveFormRef.current,
          waveColor :"#ccc",
          progressColor:"#4a9eff",
          cursorColor:"#7ae3c3",
          barWidth:2,
          height:30,
          responsive:true,
      })
      setWaveForm(wavesurfer);
      wavesurfer.on("finish",()=>{
        setIsPlaying(false);
      })
      return ()=>{
        wavesurfer.destroy();
      }
  },[])
  useEffect(()=>{
    if(waveForm) handleStartRecording();
  },[waveForm])
  return <div className="flex text-2xl w-full justify-end items-center ">
      <div className="pt-1">
    <FaTrash className=" text-panel-header-icon"
      onClick={()=>{hide()}}
    />
    </div>
     <div className="mx-2 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg ">
        {
          isRecording ?
          
          (  <div className="text-red-500 animate-pulse w-60 text-center">
              recording 
               <span> {recordingDuration}</span>
            </div>
          )
            :
            (
            <div>
                {
                  recorderedAudio && (
                  <>
                    {!isPlaying ? (<FaPlay onClick={handlePlayRecording}/>) : (<FaStop onClick={handlePauseRecording}/>)}
                  </>
            )}
            </div> 
            )
        }
        <div className="w-60" ref={waveFormRef} hidden={isRecording}/>
        {
          recorderedAudio && isPlaying &&
            <span>{formatTime(currentPlayBackTime)}</span>
        }
          {
            recorderedAudio && !isPlaying && 
            <span> {formatTime(totalDuration)}</span>
          }
        <audio ref={audioRef} hidden/>
        </div>
        <div className="mr-4">
            {
              !isRecording ? ( <FaMicrophone className="text-red-500"
                onClick={handleStartRecording}
              /> ): (<FaPauseCircle className="text-red-500"
              onClick={handleStopRecording}
              />)
            }
            </div>
     <div>
     <MdSend
      className="text-panel-header-icon cursor-pointer mr-4" title="send"
      onClick={sendRecording}
     />
      </div>
  
   
     </div>

}

export default CaptureAudio;
