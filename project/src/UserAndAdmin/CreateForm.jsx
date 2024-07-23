import React, { useState } from 'react';
import MD5 from "crypto-js/md5";

export default function CreateForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(10); // set Default value as user.
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (username === "") {
            setErrorMessage("Please input a valid username.");
            setSuccessMessage("");
            return;
          }
        
            // Password validation
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
            if (!passwordRegex.test(password)) {
              setErrorMessage(
                "Password must contain at least one character and one number, and have a length between 6 and 20 characters."
              );
              setSuccessMessage("");
              return;
            }

        const data = {
            role: role,
            username: username,
            password: MD5(password).toString(),
        };

        const response = await fetch('/user', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const output = await response.text();
        if (response.status === 409) {
            setErrorMessage("This username has been registered. Please use another one.")
            setSuccessMessage("");
          }
          else if (response.status === 403) {
            setErrorMessage("Unauthorized action.")
            setSuccessMessage("");
          }
          else if (response.status === 201) {
            setSuccessMessage("Registration is successful. You can login with the created username and password now.");
            setErrorMessage("");
          }
          else if (response.status === 500) {
            setErrorMessage("System Error. Please try again later.");
            setSuccessMessage("");
          }
      
          // Reset the form fields
          setUsername("");
          setPassword("");
          setRole(10);
    };

    return (
        <form id="createForm" onSubmit={handleSubmit}>
            <h2>Please create a new user/admin.</h2>
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
                <div className="d-flex flex-column">
                    <label htmlFor="password">Password :</label>
                    <input 
                        className="form-control-lg" 
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} 
                    />
                </div>
                <div className='radioForm'>
                    <div className='selection1'>
                        <label>
                            <input 
                                type="radio"
                                value={10}
                                checked={role === 10}
                                onChange={() => setRole(10)}
                            />
                            User
                        </label>
                    </div>
                    <div className='selection2'>
                        <label>
                            <input 
                                type="radio"
                                value={99}
                                checked={role === 99}
                                onChange={() => setRole(99)}
                            />
                            Admin
                        </label>
                    </div>
                </div>
                <button className="btn btn-primary" type="submit">Create</button>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {successMessage && <p className="text-success">{successMessage}</p>}
            </div>
        </form>
    );
};

