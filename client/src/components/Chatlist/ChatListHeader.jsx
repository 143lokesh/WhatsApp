import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {BsFillChatLeftTextFill,BsThreeDotsVertical} from "react-icons/bs"
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import ContextMenu from "../common/ContextMenu";

function ChatListHeader() {
  const [{userInfo},dispatch]=useStateProvider();
  const router= useRouter();
  const [contextMenuCoordinates,setContextMenuCoordinates]=useState({
    x:0,
    y:0,
  })
  const [isContextMenuAvailable,setIsContextMenuAvailable]=useState(false);
  const showContextMenu=(e)=>{
    e.preventDefault();
    setContextMenuCoordinates({x:e.pageX , y:e.pageY});
    setIsContextMenuAvailable(true);
  }
  const contextMenuOPtions=[
    {
      name:"Logout",
      callback:async()=>{
        setIsContextMenuAvailable(false);
       router.push('/logout');
      }
    }
  ]
  const handleAllContactsPage = ()=>{
     dispatch({
      type:reducerCases.SET_ALL_CONTACTS_PAGE
     })
  }
  return <div className="h-16 px-4 py-3 flex justify-between items-center">
   <div className="cursor-pointer">
      <Avatar type="sm" image={userInfo?.profileImage}/>
   </div>
   <div className="flex gap-6">
    <BsFillChatLeftTextFill className="text-panel-header-icon cursor-pointer text-xl"
      title="new Chat"
      onClick={handleAllContactsPage}
    />
    <>
    <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl"
      title="Menu"
      onClick={(e)=>showContextMenu(e)}
      id="context-opener"
    />
     {
          isContextMenuAvailable && (
            <ContextMenu options={contextMenuOPtions}
            coordinates={contextMenuCoordinates}
            ContextMenu={isContextMenuAvailable}
            setContextMenu={setIsContextMenuAvailable}
            />
          )
        }
    </>
  
   </div>
  </div>;
}

export default ChatListHeader;
