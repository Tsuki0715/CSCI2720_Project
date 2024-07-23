import React, { useEffect ,useState } from 'react';
import './header.css'
import './container.css'
import {Link} from 'react-router-dom';


export default function UserFavorite(){

    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`/favorite`, {
              method: 'GET',
              headers: { "Content-Type": "application/json" },
            });
      
            if (response.status === 404) {
              setErrorMessage("Favorite locations not found.");
            } else if (response.status === 403) {
              setErrorMessage("Unauthorized user. Please login.");
            } else if (response.status === 500) {
              setErrorMessage("System Error. Please try again later.");
            } else if (response.status === 200) {
                const output = await response.json();
                const fetchDataForEachLocation = async () => {
                  const locationData = [];
                  for (const locationName of output) {
                    const response = await fetch('/locationDetail', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ locationname: locationName })
                    });
        
                    if (response.status === 200) {
                      const data = await response.json();
                      locationData.push(data);
                    }
                  }
                  setData(locationData);
                };
                fetchDataForEachLocation();
              }
            } catch (error) {
              console.log(error);
              setErrorMessage("Error occurred during the request.");
            }
          };
        
          fetchData();
        }, []);

    return (
        <>
            <table className="event-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Number of Events</th>
                    </tr>
                </thead>
                <tbody id="locationTable">
                    {data && data.map((location, index) => (
                        <tr key={index}>
                            <td>
                            <Link to={"/profile/location/" + location.Venue}>
                                {location.Venue}
                            </Link>
                            </td>
                            <td>
                                {location.NumberOfEvents}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </>
    );
}