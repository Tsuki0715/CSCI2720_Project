//Home page for admin
import React, { useState } from 'react';
import { getCookie } from '../Visitor/CookieHandlers';

export default function AdminHome(){
    const [username, setUsername] = useState(getCookie("username"));
    
    return <>
        <main>
            <h1>Home for {username}</h1>
        </main>
    </>
    }