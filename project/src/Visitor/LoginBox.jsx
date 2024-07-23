//login pop up
import React from 'react';
import { useEffect } from 'react'
import './LoginBox.css'
import MD5 from "crypto-js/md5";
import { useNavigate } from 'react-router';
export default function Login(){

    const navigate = useNavigate();
    //load saved username from cookie
    
    //handler for open/close forms
    function closeForm(){
        document.getElementById("loginForm").style.display = "none";
    }
    function openForm(){
        document.getElementById("loginForm").style.display = "block";
    }
    //handler for fetching of the form
    useEffect(() => {
        document.getElementById('loginForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('usernameInput').value;
            const password = document.getElementById('pswInput').value;
            const rem = document.getElementById('rememberCheckbox').checked;
            const data = {
                username: name,
                password: MD5(password).toString(),
                rem: rem
            };
      
            // use POST method to send a request to the server
            const response = await fetch('/login', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
            if (response.status === 200){
                //successful login
                const resdata = await response.json()
                document.cookie = "username="+resdata.username ;
                document.cookie = "role="+ resdata.role;
                navigate('/profile')
            }else{
                //bad login: return error message
                console.log(response.body)
            }
        })
    
    })
    return <>
        <h1 style={{marginTop: "10px", marginLeft: "100px"}}>Cultural Program App</h1>
        <p style={{marginTop: "10px", marginLeft: "100px"}}>Last update time: {new Date().toLocaleTimeString()}</p>
        <button className="open-button" onClick={() => openForm()}>Login</button>
        <div className="form-popup" id="loginForm">
            <form action="/login" method='POST' className="form-container">
            <h1>Login</h1>
            <label htmlFor="username" >
                <b>Username</b>
            </label>
            <input id="usernameInput" type="text" placeholder="Enter Username" name="username" required/>
            <label htmlFor="psw">
                <b>Password</b>
            </label> 
            <input
                id='pswInput'
                type="password" 
                placeholder="Enter Password"
                name="psw"
                required
            />
            <div className="checkbox-container">
                <input type="checkbox" id="rememberCheckbox"/>
                <label htmlFor="myCheckbox">Remember me for 30 days</label>
            </div>
            
            <button type="submit" className="btn">
                Login
            </button>           
            <button type="button" className="btn cancel" onClick={() => closeForm()}>
                Close
            </button>
            </form>
        </div>
    </>
}
