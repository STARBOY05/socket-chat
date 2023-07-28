import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BiPowerOff } from 'react-icons/bi#BiPowerOff';

function Logout() {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className='logout-btn'>
            <BiPowerOff onClick={handleLogoutClick} />
        </div>
    )
}

export default Logout