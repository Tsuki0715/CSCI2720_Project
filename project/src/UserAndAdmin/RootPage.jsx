//Page to display once login success
import React, { useState } from 'react';
import { getCookie } from '../Visitor/CookieHandlers';

export default function RootPage(){
    const [username, setUsername] = useState(getCookie("username"));
    
    return <>
        <main>
            <h1>Welcome {username}</h1>
            <p>Please select the page you would like to visit.</p>
        </main>
    </>
    }