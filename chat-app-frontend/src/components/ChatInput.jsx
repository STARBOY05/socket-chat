import React, { useEffect, useState } from 'react'
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import "./chatInput.css";
import axios from 'axios';

function ChatInput({ handleSendMessage }) {

    const [message, setMessage] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (emojiObject) => {
        let mess = message;
        mess += emojiObject.emoji;
        setMessage(mess);
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (message.length > 0) {
            handleSendMessage(message);
            setMessage("");
        }

        setShowEmojiPicker(false);
    };

    const handleSuggestionClick = (word) => {
        // Get the last word from the message (incomplete word)
        const lastWordIndex = message.lastIndexOf(" ") + 1;
        const incompleteWord = message.substring(lastWordIndex);
        // Replace the incomplete word with the selected suggested word
        const newMessage = message.slice(0, lastWordIndex) + word;
        setMessage(newMessage);
    }

    useEffect(() => {
        const getSuggestions = async () => {
            await axios.get(`https://api.datamuse.com/sug?s=${message.split(" ").splice(-1)}&max=3`).then((resp) => {
                setSuggestions(resp.data)
            })
        }

        if (message !== "") {
            const timeout = setTimeout(() => getSuggestions(), 1000);
            return () => clearTimeout(timeout);
        }
        else {
            setSuggestions([]);
        }

    }, [message])

    return (
        <div className="chat-input-container">
            <div className='chat-input-top'>
                <div className="button-container">
                    <div className="emoji">
                        <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                        {showEmojiPicker && <Picker height="375px" onEmojiClick={handleEmojiClick} />}
                    </div>
                </div>
                <form className="input-container" onSubmit={(event) => sendChat(event)}>
                    <input
                        type="text"
                        placeholder="Type your message here"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    />
                    <button type="submit">
                        <IoMdSend />
                    </button>
                </form>
            </div>
            {
                suggestions.length > 0 && <div className='chat-suggestions'>
                    <div className='chat-suggestion-list'>
                        {suggestions.map((item, index) => {
                            return (<p style={{ "cursor": "pointer" }} key={index} onClick={() => { handleSuggestionClick(item.word) }}>{item.word}</p>)
                        })}
                    </div>
                </div>
            }
        </div >
    )
}

export default ChatInput