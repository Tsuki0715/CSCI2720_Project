//main page for users and admin
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router";
import UserSideNav from "./UserSideNav";
import UserHeader from "./UserHeader";
import AdminSideNav from './AdminSideNav';
import { Outlet } from "react-router-dom";

import './container.css'
import { getCookie } from '../Visitor/CookieHandlers';


export default function UserPage(){
    //const locationdata = useLocation();
    const [role, setRole] = useState("");
    const [logged, setLogged] = useState(true);
    useEffect(() => {
        fetch('/logged',{method : 'GET'})
        .then(response => response.text())
        .then(data => {
            if (data === 'logged'){
                setLogged(true)
            }else if (data === 'unauthorized'){
                setLogged(false)
            }
        })
        setRole(getCookie("role"))
    })
    if (!logged){
        //prevent access from URL
        return <h1>You have not log in</h1>
    }
    else if (role === "10") {
        return <>
            {/* <UserContext.Provider value={{ role: state.role, username: state.username }}> */}
            <UserHeader />
            <UserSideNav />
            <div className="user-container d-flex justify-content-center">
                <div className="main-container">
                    <Outlet/>
                </div>
            </div>
            {/* </UserContext.Provider> */}
        </>
    }
    else if (role === "99") {
        return <>
            {/* <UserContext.Provider value={{ role: state.role, username: state.username }}> */}
            <UserHeader />
            <AdminSideNav />
            <div className="user-container d-flex justify-content-center">
                <div className="main-container">
                    <Outlet/>
                </div>
            </div>
            {/* </UserContext.Provider> */}
        </>
    }
}