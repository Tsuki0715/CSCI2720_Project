import React, { useState } from 'react';
import { useEffect } from "react";
import './container.css'
import { getCookie } from '../Visitor/CookieHandlers';

export default function UserEvent() {
    const [username, setUsername] = useState(getCookie("username"));
    const [EventData, setEventData] = useState([]);
  
    useEffect(() => {
      // initial search for all data
      fetch('/event', {
        method: "POST",
      })
        .then(response => response.json())
        .then(data => {
          setEventData(data);
        });
    }, []);
  
    function listAllEventData(data) {
      const tableBody = document.getElementById('tableBody');
      for (var y in data) {
        var x = data[y];
        let newTableRow = document.createElement('tr');
        let element = '<th></th><th></th><th></th><th></th><th></th>';
        newTableRow.innerHTML = element;
        newTableRow.querySelectorAll('th')[0].innerHTML = x.Title;
        newTableRow.querySelectorAll('th')[1].innerHTML = x.Venue;
        newTableRow.querySelectorAll('th')[2].innerHTML = x.Date;
        newTableRow.querySelectorAll('th')[3].innerHTML = x.Time;
        newTableRow.querySelectorAll('th')[4].innerHTML = x.Price;
        tableBody.appendChild(newTableRow);
      }
    }
  
    async function Search() {
      var filterLowPrice = document.getElementById("lowPrice").value;
      var filterHighPrice = document.getElementById("highPrice").value;
      // setting default values
      filterHighPrice = filterHighPrice === '' ? 100000 : filterHighPrice;
      filterLowPrice = filterLowPrice === '' ? 0 : filterLowPrice;
      const data = {
        filterLowPrice: filterLowPrice,
        filterHighPrice: filterHighPrice
      };
      const response = await fetch('/eventfilter', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      var resdata = await response.json();
      setEventData(resdata);    
    }
  
    return (
      <>
        <div className="input-container d-grid gap-4">
          <div className="d-flex flex-column input-body">
            <label>Price :</label>
            <div className="d-flex flex-row align-items-center input-box">
              <input className="col form-control-lg" type="number" id="lowPrice" placeholder="Lowest" />
              <p style={{ padding: 0, margin: "0px 10px", width: "100%", textAlign: "center" }}>To</p>
              <input className="col form-control-lg" type="number" id="highPrice" placeholder="Highest" />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: "10px" }} onClick={Search}>Search</button>
        </div>
        <br />
        <table className="event-table" id="dataTable">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Venue</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody id="tableBody" className='scrollable-list'>
            {EventData.map((event, index) => (
              <tr key={event._id}>
                <th scope="row">{index + 1}</th>
                <td>{event.Title}</td>
                <td>{event.Venue}</td>
                <td>{event.Date.length > 1 ? event.Date.map((d,index)=>{if(event.Date.length-1 == index) {return event.Date} else{event.Date[index]+=', ';}}) : event.Date[0]}</td>
                <td>{event.Time}</td>
                <td>{event.Price.length > 1 ? event.Price.map((p,index)=>{if(event.Price.length-1 == index) {return event.Price} else{event.Price[index]+=', ';}}) : event.Price[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }