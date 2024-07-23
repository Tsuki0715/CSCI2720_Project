//main page for Visitor
import React, { useEffect } from 'react';
import LoginBox from "./LoginBox";
import SlideShowDisplay from "./SlideShowDisplay";
import RegistrationForm from "./RegistrationForm";
import CalendarAndList from "./CalendarAndList";
import { useNavigate } from 'react-router-dom';

export default function VisitorPage(){
    const navigate = useNavigate();
    useEffect(() => {
        fetch('/login', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          }).then(async response => {
                if (response.status === 200){
                    const resdata = await response.json()
                    //successful login
                    document.cookie = "username=" + resdata.username;
                    document.cookie = "role="+ resdata.role;
                    navigate('/profile')
                }
          })
          
    }, []);
    return <>
        <LoginBox />
        <SlideShowDisplay />
        <RegistrationForm />
        <CalendarAndList />
    </>
}

