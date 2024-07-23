import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarAndList.css'

export default function CalendarAndList() {
	const [value, onChange] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);

    const formatSelectedDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
      };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        fetchEventsForDate(date);
    }

    const fetchEventsForDate = async (date) => {
        // fetch the API data and return a list of activities for the selected date. 
        // return an empty list if there isn't any.
        if (!date) {
            setEvents([]);
            return;
        }

        const formattedDate = formatSelectedDate(date);
        const data = {
            date: formattedDate
        }
        const response = await fetch('/eventdatematch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const output = await response.json();

        if (response.status === 200) {
            setEvents(output);  
        }
        else if (response.status === 404) {
            setEvents("Error occured.")
            return;
        }
    }


	return (
            <div className="container" >
                    <div className="calendar">
                        <Calendar
                            onChange={onChange}
                            value={value}
                            onClickDay={handleDateClick}
                        />
                    </div>
                    <div className="list">
                        <h2>{selectedDate ? `Events for ${formatSelectedDate(selectedDate).toString()}` : "Please select a date."}</h2>
                        <ul className='scrollable-list'>
                            {events.map((event,index) => (
                                <li key={index}>{event.Title}</li>
                            ))}
                        </ul>
                    </div>
            </div>
	);
}
