import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
const  VoiceMessage = dynamic(()=>import("./VoiceMessage"),{
  ssr:false,
})
//bg-chat-background  fixed  2nd div
function ChatContainer() {
  const [{messages,currentChatUser,userInfo}]=useStateProvider();
  return <div className="h-[80vh] bg-chat-background bg-fixed  w-full flex-grow  z-0  overflow-auto custom-scrollbar">
   <div className=" h-full w-full   ">
   <div className="mx-10 my-6 relative bottom-0 z-40 left-0  ">
    <div className="flex w-full mt-1">
      <div className="  flex flex-col justify-end w-full gap-1 mb-2  overflow-auto  ">
           {
            messages.map((message)=>{
              return <div key={message.id} 
               className={` flex ${message.senderId===currentChatUser.id ?"justify-start":"justify-end" } text-white opacity-100 z-10 `}
              >
                {
                  message.type==="text" &&(
                     <div className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2  max-w-[45%]  ${message.senderId===currentChatUser.id ? "bg-incoming-background" :
                      "bg-outgoing-background"}`}>
                      <span className="break-all text-white">{message.message}</span>
                      <div className="flex gap-1 items-end ">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {
                          calculateTime(message.createdAt)
                        }
                      </span>
                      <span>
                        {
                          message.senderId===userInfo.id && (
                          <MessageStatus messageStatus={message.messageStatus}/>
                          )
                        }
                      </span>
                      </div>
                     </div>
                  )
                }
                {
                  message.type==="image" && <ImageMessage message={message}/>
                }
                {
                  message.type==="audio" && <VoiceMessage message={message}/>
                }
              </div>
            })
           }
      </div>
      </div>
    </div>
   </div>

  </div>;
}

export default ChatContainer;
