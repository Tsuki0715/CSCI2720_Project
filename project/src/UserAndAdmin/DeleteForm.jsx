import React, { useState } from 'react';

export default function DeleteForm() {
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (username === "") {
            setErrorMessage("Please input a valid username.");
            setSuccessMessage("");
            return;
          }

        const data = {
            username: username,
        };

        const response = await fetch(`/user/${username}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            },
        });

        const output = await response.text();
        if (response.status === 404) {
            setErrorMessage("This username is not registered.")
            setSuccessMessage("");
          }
          else if (response.status === 403) {
            setErrorMessage("Unauthorized action.")
            setSuccessMessage("");
          }
          else if (response.status === 204) {
            setSuccessMessage("Delete is successful.")
            setErrorMessage("");
          }
          else if (response.status === 500) {
            setErrorMessage("System Error. Please try again later.");
            setSuccessMessage("");
          }
      
          // Reset the form fields
          setUsername("");
    };

    return (
        <form id="deleteForm" onSubmit={handleSubmit}>
            <h2>Please delete an user.</h2>
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
            </div>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
        </form>
    );
};

