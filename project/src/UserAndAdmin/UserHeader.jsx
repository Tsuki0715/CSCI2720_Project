//UserHeader includes header and logout of users
import React, { useState } from 'react';
import { useEffect } from 'react';
import './header.css'
import { getCookie } from '../Visitor/CookieHandlers';
import { useNavigate } from 'react-router-dom';



export default function UserHeader(){
    const [username, setUsername] = useState(getCookie("username"));
    const [updateTime, setUpdateTime] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchLastUpdateTime();
    }, [])

    async function fetchLastUpdateTime() {
        try {
            const response = await fetch('/profile/lastUpdateTime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await response.json();
            if (response.status === 200) {
                setUpdateTime(data.lastUpdateTime);
            }
            else if (response.status === 404) {
                setUpdateTime("Error occurred.");
            }
        } catch (error) {
            console.log("Server Error.");
        }
    }

    
    function Logout(){
        return (
            <div className="user-dropdown btn-group">
                <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {username}
                </button>
                <div className="dropdown-menu dropdown-menu-right">
                    <button className="dropdown-item" type="button" onClick={() => logout()}>Logout</button>
                </div>
            </div>
        );
    }
    async function logout(){
        //remove cookie
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        //logout
        fetch('/logout',{
            method : "GET",
        })
        navigate('/')
        window.alert("Logged out")
    }
    return  (<>   
    <div className="header d-flex justify-content-between">
        <i className="bi bi-globe-americas"></i>
        <p >Welcome ! {username}</p>
        <p style={{marginTop: "10px", marginLeft: "100px"}}>Last update time: {updateTime}</p>
        <div className="account-block d-flex">
            <Logout/>
        </div>
    </div>
    </> 
    );
}