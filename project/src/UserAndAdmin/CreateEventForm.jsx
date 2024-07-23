import React, { useState } from 'react';

export default function CreateEventForm() {
    const [eventID, setEventID] = useState();
    const [eventLocation, setEventLocation] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventPresenter, setEventPresenter] = useState('');
    const [eventPrice, setEventPrice] = useState();

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!eventID || eventLocation === "" || eventTitle === "" || eventDate === "" || eventTime === "" || eventDescription === "" || eventPresenter === "" || !eventPrice) {
            setErrorMessage("Please input all the fields");
            setSuccessMessage("");
            return;
        }

        const data = {
            eventID: eventID,
            eventTitle : eventTitle,
            eventLocation : eventLocation,
            eventDate : eventDate,
            eventTime : eventTime,
            eventDescription : eventDescription,
            eventPresenter : eventPresenter,
            eventPrice : eventPrice,
        };

        const response = await fetch(`/adminevent`,{
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })

        const output = await response.text();
        if (response.status === 404) {
            setErrorMessage("Cannot create a new event")
            setSuccessMessage("");
          }
          else if (response.status === 403) {
            setErrorMessage("Unauthorized action.")
            setSuccessMessage("");
          }
          else if (response.status === 201) {
            setSuccessMessage("Create event is successful.");
            setErrorMessage("");
          }
          else if (response.status === 500) {
            setErrorMessage("System Error. Please try again later.");
            setSuccessMessage("");
          }
      
          // Reset the form fields
          setEventID('');
          setEventLocation('');
          setEventTitle('');
          setEventDate('');
          setEventTime('');
          setEventDescription('');
          setEventPresenter('');
          setEventPrice('');
    };

    return (
        <form id="createEventForm" onSubmit={handleSubmit}>
            <h2>Please create a new event.</h2>
            <div className="input-container d-grid gap-4">
                <div className="d-flex flex-column ">
                    <label htmlFor="createEventID">Event ID :</label>
                    <input 
                        className="form-control-lg" 
                        type="text" 
                        id="createEventID" 
                        value={eventID} 
                        onChange={(event) => setEventID(event.target.value)}
                    />
                </div>
                <div className="d-flex flex-column ">
                    <label htmlFor="createEventTitle">Title :</label>
                    <input 
                        className="form-control-lg" 
                        type="text" 
                        id="createEventTitle" 
                        value={eventTitle} 
                        onChange={(event) => setEventTitle(event.target.value)}
                    />
                </div>
                <div className="d-flex flex-column ">
                    <label htmlFor="createEventLocation">Location :</label>
                    <input 
                        className="form-control-lg" 
                        type="text" 
                        id="createEventLocation" 
                        value={eventLocation} 
                        onChange={(event) => setEventLocation(event.target.value)}
                    />
                </div>
                <div className="d-flex flex-column ">
                    <label htmlFor="createEventDate">Date :</label>
                    <input 
                        className="form-control-lg" 
                        type="date" 
                        id="createEventDate" 
                        value={eventDate} 
                        onChange={(event) => setEventDate(event.target.value)}
                    />
                </div>
                <div className="d-flex flex-column ">
                    <label htmlFor="createEventTime">Time :</label>
                    <input 
                        className="form-control-lg" 
                        type="time" 
                        id="createEventTime" 
                        value={eventTime} 
                        onChange={(event) => setEventTime(event.target.value)}
                    />
                </div>
                <div className="d-flex flex-column ">
                    <label htmlFor="createEventDescription">Description :</label>
                    <input 
                        className="form-control-lg" 
                        type="text" 
                        id="createEventDescription" 
                        value={eventDescription} 
                        onChange={(event) => setEventDescription(event.target.value)}
                    />
                </div>
                <div className="d-flex flex-column ">
                    <label htmlFor="createEventPresenter">Presenter :</label>
                    <input 
                        className="form-control-lg" 
                        type="text" 
                        id="createEventPresenter" 
                        value={eventPresenter} 
                        onChange={(event) => setEventPresenter(event.target.value)}
                    />
                </div>
                <div className="d-flex flex-column ">
                    <label htmlFor="createEventPrice">Price :</label>
                    <input 
                        className="form-control-lg" 
                        type="number" 
                        id="createEventPrice" 
                        value={eventPrice} 
                        onChange={(event) => setEventPrice(event.target.value)}
                    />
                </div>
                <button className="btn btn-primary" type="submit">Create</button>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {successMessage && <p className="text-success">{successMessage}</p>}
            </div>
        </form>
    );
};

