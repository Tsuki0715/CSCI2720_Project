import React, { useState } from 'react';

export default function UpdateEventForm() {
    const [eventID, setEventID] = useState();
    const [eventLocation, setEventLocation] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventPresenter, setEventPresenter] = useState('');
    const [eventPrice, setEventPrice] = useState();

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmitRead = async(event) => {
        event.preventDefault();

        if (!eventID) {
            setErrorMessage("Please input a valid event ID.");
            setSuccessMessage("");
            return;
        }

        const response = await fetch(`/adminevent/${eventID}`,{
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })

        setEventTitle('');
        setEventLocation('');
        setEventDate('');
        setEventTime('');
        setEventDescription('');
        setEventPresenter('');
        setEventPrice('');
        
        const output = await response.json();
        if (response.status === 404) {
            setErrorMessage("Event not found.")
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
            setErrorMessage("");
            setEventID(output.EventID);
            setEventTitle(output.Title);
            setEventLocation(output.Venue);
            setEventDate(output.Date);
            setEventTime(output.Time);
            setEventDescription(output.Description);
            setEventPresenter(output.Presenter);
            setEventPrice(output.Price[0]);
        }
    }

    const handleSubmitUpdate = async (event) => {
        event.preventDefault();

        if (!eventID || eventLocation === "" || eventTitle === "" || eventDate === "" || eventTime === "" || eventDescription === "" || eventPresenter === "" || !eventPrice) {
            setErrorMessage2("Please input all the fields");
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

        const response = await fetch('/adminevent', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const output = await response.text();
        if (response.status === 200) {
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
        setEventTitle('');
        setEventLocation('');
        setEventDate('');
        setEventTime('');
        setEventDescription('');
        setEventPresenter('');
        setEventPrice('');
    };
  
    return (
        <div>
            <h2>Please fill in the event ID to read the informaion.</h2>
            <form id="ReadForm" onSubmit={handleSubmitRead}>
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
                    <button className="btn btn-primary" type="submit">Submit</button>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <div className="read-print" id="usertobedisplayed">
                        <p>* Please click the submit button to print the event information here. *</p>
                        <table className="read-table" id="eventDetail">
                            <thead>
                                <th style={{width: "30%"}}>Event</th>
                                <th>Detail</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Title</td>
                                    <td>{eventTitle}</td>
                                </tr>
                                <tr>
                                    <td>Location</td>
                                    <td>{eventLocation}</td>
                                </tr>
                                <tr>
                                    <td>Date</td>
                                    <td>{eventDate}</td>
                                </tr>
                                <tr>
                                    <td>Time</td>
                                    <td>{eventTime}</td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>{eventDescription}</td>
                                </tr>
                                <tr>
                                    <td>Presenter</td>
                                    <td>{eventPresenter}</td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>{eventPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>

            <form id="updateEventForm" onSubmit={handleSubmitUpdate}>
                <h2>Please update a new informaion for this event.</h2>
                <div className="input-container d-grid gap-4">
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
                    <button className="btn btn-primary" type="submit">Update</button>
                    {errorMessage2 && <p className="text-danger">{errorMessage2}</p>}
                    {successMessage && <p className="text-success">{successMessage}</p>}
                </div>
            </form>
        </div>
    );
};

