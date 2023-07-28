import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../../utils/APIRoutes";
import "./setAvatar.css";


export default function SetAvatar() {

    // API URL
    const api = `https://api.multiavatar.com/4645646`;

    // Navigate hook
    const navigate = useNavigate();

    // Use States
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    // Toast Features
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    // UseEffect for auth
    useEffect(() => {
        if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
            navigate("/login");
    }, []);

    // UseEffect to render avatars
    useEffect(() => {
        const fetchAvatars = async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        };
        fetchAvatars(); // Call the async function immediately
    }, []);

    // handle setting of profile picture
    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        }
        else {
            const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            const { data } = await axios.post(`${setAvatarRoute}/${user?._id}`, { image: avatars[selectedAvatar] });
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(user));
                navigate("/");
            }
            else {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="avatar-container">
                    <img src={loader} alt="loader" className="loader" />
                </div>
            ) : (
                <div className="avatar-container">
                    <div className="title-container">
                        <h1>Select an Avatar for your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, idx) => {
                            return (
                                <div
                                    className={`avatar ${selectedAvatar === idx ? "selected" : ""}`}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                        key={avatar}
                                        onClick={() => setSelectedAvatar(idx)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={setProfilePicture} className="submit-btn">
                        Set as Profile Picture
                    </button>
                    <ToastContainer />
                </div>
            )}
        </>
    );
}