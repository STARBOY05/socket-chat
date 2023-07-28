import React, { useEffect, useState } from 'react'
import Logo from "../assets/logo.svg";
import "./contacts.css";

function Contacts({ contacts, currUser, chatChange, currSelected, setCurrSelected }) {
    const [currUserName, setCurrUserName] = useState(undefined);
    const [currUserImage, setCurrUserImage] = useState(undefined);
    useEffect(() => {
        const fetchCurrUser = async () => {
            const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            setCurrUserName(data?.username);
            setCurrUserImage(data?.avatarImage);
        }
        if (currUser) {
            fetchCurrUser();
        }
    }, [currUser]);

    const currChatChange = (idx, contact) => {
        setCurrSelected(idx);
        chatChange(contact);
    }

    return (
        <>
            {currUserName && currUserImage && (
                <div className={`${currSelected === undefined ? "contacts-container" : "contacts-container hide-contacts"}`}>

                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h3>SocketChat</h3>
                    </div>

                    <div className="contacts">
                        {contacts.map((contact, idx) => {
                            return (
                                <div
                                    key={contact?._id}
                                    className={`contact ${idx === currSelected ? "selected" : ""}`}
                                    onClick={() => currChatChange(idx, contact)}
                                >
                                    <div className="avatar">
                                        <img
                                            src={`data:image/svg+xml;base64,${contact?.avatarImage}`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{contact?.username}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="current-user">
                        <div className="avatar">
                            <img
                                src={`data:image/svg+xml;base64,${currUserImage}`}
                                alt="avatar"
                            />
                        </div>
                        <div className="username">
                            <h2>{currUserName}</h2>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Contacts