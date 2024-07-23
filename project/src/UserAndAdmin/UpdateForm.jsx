import React, { useState } from 'react';
import MD5 from "crypto-js/md5";

export default function UpdateForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmitRead = async(event) => {
      event.preventDefault();

      if (username === "") {
        setErrorMessage("Please input a valid username.");
        setSuccessMessage("");
        return;
      }

      const data = {
        username:username
      };

      const response = await fetch(`/user/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      const password = await response.text();
      if (response.status === 404) {
        setErrorMessage("user not found.")
        setSuccessMessage("");
      }
      else if (response.status === 403) {
        setErrorMessage("Unauthorized action.")
        setSuccessMessage("");
      }
      else if (response.status === 500) {
        setErrorMessage("System Error. Please try again later.");
        setSuccessMessage("");
      }
      else if (response.status === 200) {
        const userDisplayed = document.getElementById('usertobedisplayed');
        userDisplayed.innerHTML = `
        <div style="justify-content: center">
          <p>"Username": ${username}</p>
          <p>"Password": ${password}</p>
        </div>
        `;
      }

      setUsername("");
    }

    const handleSubmitUpdate = async (event) => {
        event.preventDefault();
        
        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
        if (!passwordRegex.test(password)) {
          setErrorMessage2(
            "Password must contain at least one character and one number, and have a length between 6 and 20 characters."
          );
          setSuccessMessage("");
          return;
        }

        const data = {
            username: username,
            password: MD5(password).toString(),
        };

        const response = await fetch('/user', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const output = await response.text();
        if (response.status === 204) {
            setSuccessMessage("Update is successful.");
            setErrorMessage2("");
        }
        else if (response.status === 403) {
          setErrorMessage("Unauthorized action.")
          setSuccessMessage("");
        }
        else if (response.status === 500) {
          setErrorMessage2("System Error. Please try again later.");
          setSuccessMessage("");
        }
      
          // Reset the form fields
          setPassword("");
    };

    return (
        <div>
          <h2>Please fill in the username to read the informaion.</h2>
          <form id="ReadForm" onSubmit={handleSubmitRead}>
            <div className="input-container d-grid gap-4">
              <div className="d-flex flex-column ">
                <label htmlFor="username">Username :</label>
                <input 
                    className="form-control-lg" 
                    type="text" 
                    id="username" 
                    value={username} 
                    onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit">Submit</button>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <div id="usertobedisplayed" style={{marginTop: "2%", marginBottom: "2%", display:"flex", justifyContent: "center", fontSize: "medium"}}>
                  <p>Please click the submit button to print the user information here.</p>
              </div>
            </div>
          </form>

          <h2>Please update a new password for this user.</h2>
          <form id="UpdateForm" onSubmit={handleSubmitUpdate}>
            <div className="input-container d-grid gap-4">
              <div className="d-flex flex-column ">
                <label htmlFor="password">Password:</label>
                <input
                    className="form-control-lg"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)} 
                />
              </div>
              <button className="btn btn-primary" type="submit">Update</button>
              {errorMessage2 && <p className="text-danger">{errorMessage2}</p>}
              {successMessage && <p className="text-success">{successMessage}</p>}
            </div>
          </form>
        </div>
    );
};

