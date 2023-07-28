import React, { useEffect, useRef, useState } from 'react'
import "./chat.css";
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host } from '../../utils/APIRoutes';
import axios from 'axios';
import Contacts from '../../components/Contacts';
import Welcome from '../../components/Welcome';
import ChatContainer from '../../components/ChatContainer';
import io from "socket.io-client";

function Chat() {

  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [currUser, setCurrUser] = useState(undefined);
  const [currChat, setCurrChat] = useState(undefined)
  const [isLoaded, setIsLoaded] = useState(false);
  const [currSelected, setCurrSelected] = useState(undefined);

  // useRef
  const socket = useRef();

  // UseEffect for auth
  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
    else {
      setCurrUser(JSON.parse(localStorage.getItem("chat-app-user")));
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      const data = await axios.get(`${allUsersRoute}/${currUser._id}`);
      setContacts(data.data);
    }
    if (currUser) {
      if (currUser.isAvatarImageSet) {
        fetchContacts();
      }
      else {
        navigate("/setAvatar");
      }
    }
  }, [currUser]);

  useEffect(() => {
    if (currUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currUser._id);
    }
  }, [currUser]);

  const handleChatChange = (chat) => {
    setCurrChat(chat);
  }

  return (
    <>
      <div className='chat-container'>
        <div className='chat-main-container'>
          <Contacts contacts={contacts} currUser={currUser} chatChange={handleChatChange} currSelected={currSelected} setCurrSelected={setCurrSelected} />
          {
            isLoaded && currChat === undefined ? (<Welcome currUser={currUser} />) : (<ChatContainer currChat={currChat} currUser={currUser} socket={socket} setCurrSelected={setCurrSelected} setCurrChat={setCurrChat}/>)
          }
        </div>
      </div>
    </>
  )
}

export default Chat