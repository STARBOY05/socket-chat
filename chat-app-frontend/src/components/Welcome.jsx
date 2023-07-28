import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Robot from "../assets/robot.gif";
import "./welcome.css";

function Welcome() {
    const [currUser, setCurrUser] = useState(undefined);
    const navigate = useNavigate();

    // UseEffect for auth
    useEffect(() => {
        if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            navigate("/login");
        }
        else {
            setCurrUser(JSON.parse(localStorage?.getItem("chat-app-user")));
        }
    }, []);

    return (
        <div className='welcome-container'>
            <img src={Robot} alt="robot" />
            <h1>
                Welcome, <span>{currUser?.username}</span>
            </h1>
            <br />
            <h3>Please select a chat to start messaging.</h3>
        </div>
    )
}

export default Welcome