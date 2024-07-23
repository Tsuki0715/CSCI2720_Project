import React, { useState } from 'react';

export default function DeleteEventForm() {
    const [eventID, setEventID] = useState();

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!eventID) {
            setErrorMessage("Please input a valid event ID.");
            setSuccessMessage("");
            return;
        }

        const response = await fetch(`/adminevent/${eventID}`,{
            method: 'DELETE',
            headers: {"Content-Type": "application/json"},
        })

        const output = await response.text();
        if (response.status === 404) {
            setErrorMessage("Event not found.")
            setSuccessMessage("");
          }
          else if (response.status === 403) {
            setErrorMessage("Unauthorized action.")
            setSuccessMessage("");
          }
          else if (response.status === 200) {
            setSuccessMessage("Delete is successful.")
            setErrorMessage("");
          }
          else if (response.status === 500) {
            setErrorMessage("System Error. Please try again later.");
            setSuccessMessage("");
          }
      
          // Reset the form fields
          setEventID('');
    };

    return (
        <div>
            <h2>Please fill in the event ID to delete the event.</h2>
            <form id="ReadForm" onSubmit={handleSubmit}>
                <div className="input-container d-grid gap-4">
                    <div className="d-flex flex-column ">
                        <label htmlFor="eventID">Event ID :</label>
                        <input 
                            className="form-control-lg" 
                            type="text" 
                            id="eventID" 
                            value={eventID} 
                            onChange={(event) => setEventID(event.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" type="submit">Delete</button>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    {successMessage && <p className="text-success">{successMessage}</p>}
                </div>
            </form>
        </div>
    );
};

