import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";

function ChatList() {
  const [{contactsPage},dispatch]=useStateProvider();
  const [pageType,setPageTpe]=useState("default");
  useEffect(()=>{
       if(contactsPage){
          setPageTpe("all-contacts");
       }
       else{
        setPageTpe("default");
       }
  },[contactsPage]);
  return <div className="bg-panel-header-background flex flex-col max-h-screen" >
  {
    pageType==="default" && (
      <>
        <ChatListHeader/>
        <SearchBar/>
        <List/>
      </>
    )
  }
  {
    pageType==="all-contacts" && (
      <>
       <ContactsList/>
      </>
    )
  }


  </div>;
}

export default ChatList;
