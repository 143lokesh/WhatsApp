import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import {GET_INITIAL_CONTACT_ROUTE} from "@/utils/ApiRoutes"
import React, { useEffect } from "react";
import { reducerCases } from "@/context/constants";
import ChatLIstItem from "./ChatLIstItem";


function List() {
  const [{userInfo,userContacts,filterContacts},dispatch]=useStateProvider();
  useEffect(()=>{
    const getContacts = async()=>{
      try{
      const {data:{users,onlineUsers}}=await axios.get(`${GET_INITIAL_CONTACT_ROUTE}/${userInfo.id}`);
       dispatch({
        type:reducerCases.SET_ONLINE_USERS,onlineUsers
       })
       dispatch({
        type:reducerCases.SET_USER_CONTACTS,userContacts:users
       })
      }
      catch(err){
        console.log(err);
      }
    }
    if(userInfo?.id){
      getContacts();
    }

  },[userInfo])
  return <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar ">
  {
    filterContacts && filterContacts.length>0 ? 
   ( filterContacts.map((contact)=><ChatLIstItem data={contact} key={contact.id} />) ):
   (
    userContacts.map((contact)=><ChatLIstItem data={contact} key={contact.id} />)
   )
  }

    
  </div>;
}

export default List;
