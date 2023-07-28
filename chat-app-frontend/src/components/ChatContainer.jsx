import React, { useEffect, useRef, useState } from 'react'
import "./chatContainer.css";
import Logout from './Logout';
import "./logout.css";
import ChatInput from './ChatInput';
import { addMessageRoute, getAllMessagesRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { BiArrowBack } from 'react-icons/bi#BiArrowBack'
import { useNavigate } from 'react-router-dom';

function ChatContainer({ currChat, currUser, socket, setCurrSelected, setCurrChat }) {
    
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    const handleSendMessage = async (message) => {
        const data = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        socket.current?.emit("send-msg", {
            to: currChat._id,
            from: data._id,
            message,
        });
        await axios.post(addMessageRoute, {
            from: data._id,
            to: currChat._id,
            message: message,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: message });
        setMessages(msgs);
    }

    const handleBackClick = () => {
        setCurrSelected(undefined);
        setCurrChat(undefined)
    }
    // Get messages when chat changes
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const resp = await axios.post(getAllMessagesRoute, {
                    from: currUser?._id,
                    to: currChat?._id
                });
                setMessages(resp.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        if (currChat) {
            fetchMessages();
        }
    }, [currChat]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (message) => {
                setArrivalMessage({ fromSelf: false, message: message });
            });
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className='chat-display-container'>
            <div className="chat-header">
                <div className='user-details'>
                    <div className="avatar">
                        <img
                            src={`data:image/svg+xml;base64,${currChat?.avatarImage}`}
                            alt="avatarImg"
                        />
                    </div>
                    <div className='username'>
                        <h3>{currChat?.username}</h3>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "30%"}}>
                    <div className='back-btn hide-back-btn'>
                        <BiArrowBack onClick={handleBackClick} />
                    </div>
                    <Logout />
                </div>
            </div>
            <div className="chat-messages">
                {messages?.map((message, index) => {
                    return (
                        <div ref={scrollRef} key={index}>
                            <div className={`message ${message?.fromSelf ? 'sended' : 'recieved'}`} key={index}>
                                <div className="content">
                                    <p>{message?.message}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <ChatInput handleSendMessage={handleSendMessage} />
        </div>
    )
}

export default ChatContainer