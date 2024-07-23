import React, { useContext, useEffect, useState } from "react"
import {Link} from 'react-router-dom';
import './container.css'
import { useNavigate } from "react-router";
import { getCookie } from '../Visitor/CookieHandlers';



// Location tab for users and admin
export default function UserLocation(){
    const [username, setUsername] = useState(getCookie("username"));
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [keyword, setKeyword] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [sortDirection, setSortDirection] = useState(true);

    
    const [data, setData] = useState({});
    const navigate = useNavigate();

    const locationSearch = async(event) => {
        event.preventDefault();

        if (keyword === ""){
            setErrorMessage2("Please input a valid keyword.");
            setSuccessMessage("");
            return;
        }

        const data2 = {
            keyword: keyword
        }

        const response = await fetch("/location/keyword", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        });

        const keydata = await response.json();
        if (response.status === 200){
            setData(keydata);
        }
        else if (response.status === 404) {
            setErrorMessage2("Failed to search.");
            setSuccessMessage("");
        }
        else if (response.status === 500) {
            setErrorMessage2("Internal Server Error.");
            setSuccessMessage("");
        }
    }
    
    useEffect(() => {
        const data1 = {
            sort: true,
        }
        fetch('/location',{method: 'POST', headers: {'Content-Type': 'application/json'}, body:JSON.stringify(data1)})
        .then((response) => response.json())
        .then((data) => {
            data = JSON.parse(data); 
            setData(data); 
        })
       
    },[])

    function listAllLocationData(data) {
        const locationTable = document.getElementById('locationTable');
        locationTable.innerHTML = "";
    
        for (var y in data) {
            var x = data[y];
            let newTableRow = document.createElement('tr');
            let element = `<td><a href="javascript:void(0)">${x.Venue}</a></td><td>${x.NumberOfEvents}</td><td class="favourite-btn"></td>`;
            newTableRow.innerHTML = element;
    
            newTableRow.querySelector('a').onclick = () => {
                navigate('/profile/location/' + `${x.Venue}`);
            };
    
            const favoriteIcon = document.createElement('i');
            favoriteIcon.className = "bi bi-plus-circle";
            favoriteIcon.style.cursor = "pointer";
            favoriteIcon.onclick = () => handleAddFavorite(x.Venue, x.NumberOfEvents);
            newTableRow.querySelector('.favourite-btn').appendChild(favoriteIcon);
    
            locationTable.appendChild(newTableRow);
        }
    }
    

    const handleAddFavorite = async (locName) => {
        const data = {
            locName: locName,
        };

        const response = await fetch(`/savefavorite`,{
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })

        const output = await response.text();
        if (response.status === 409) {
            setErrorMessage("This location is already added.")
            setSuccessMessage("");
          }
          else if (response.status === 200) {
            setSuccessMessage("Add favorite location is successful.");
            setErrorMessage("");
          }
          else if (response.status === 500) {
            setErrorMessage("System Error. Please try again later.");
            setSuccessMessage("");
          }
    }

    const handleSorting = async () => {
        const sortedData = Object.values(data).sort((a, b) => {
            if (sortDirection) {
                return parseInt(a.NumberOfEvents) - parseInt(b.NumberOfEvents)
            } else {
                return parseInt(b.NumberOfEvents) - parseInt(a.NumberOfEvents)
            }
        });
        setSortDirection(!sortDirection);
        setData(sortedData);       
        
    }
    return <> 
        <div className="input-container d-flex flex-column ">
            <form id="locsearch" onSubmit={locationSearch}>
                <label htmlFor="searchKeyword">Search :</label>
                <input className="htmlForm-control-lg" type="text" id="searchKeyword" placeholder="venue" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
                <div><button className="btn btn-primary" type="submit">Submit</button></div>
                {errorMessage2 && <p className="text-danger">{errorMessage2}</p>}
            </form>
        </div>
        <br/> 
        <table className="event-table">
            <thead>
                <th>Name</th>
                <th className="table-btn">
                    Number of Events 
                    <i className="bi bi-arrow-down-up" onClick={() => handleSorting()}></i>
                </th>
                <th>Add Favorite</th>
            </thead>
            <tbody id="locationTable">
            {Object.keys(data).map((key) => {
                    return (
                        <tr>
                            <td>
                                <Link to={"/profile/location/" + data[key].Venue}>
                                    {data[key].Venue}
                                </Link>
                            </td>
                            <td>{data[key].NumberOfEvents}</td>
                            <td className="favorite-btn"><i className="bi bi-plus-circle" style={{cursor: "pointer"}} onClick={() => handleAddFavorite(`${data[key].Venue}`)}></i></td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        <br/>
        {successMessage && <h3 className="text-success">{successMessage}</h3>}
        {errorMessage && <h3 className="text-danger">{errorMessage}</h3>}
    </>

} 