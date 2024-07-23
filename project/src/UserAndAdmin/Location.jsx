//separate view for locations
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { getCookie } from '../Visitor/CookieHandlers';
import './container.css'


export default function Location(){
    const [username, setUsername] = useState(getCookie("username"));
    const [data, setData] = useState({});
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const {locationname} = useParams();
    
    const mapRef = useRef(null);

    const addComments = async (event) => {
        event.preventDefault();

        if (comment === "") {
            setErrorMessage("Comment cannot be empty.")
            return;
        }

        const data1 = {
            username: username,
            cm: comment,
            venue: locationname
        }


        const response = await fetch(`/location/newcomment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data1)
        });

        const message = await response.text();
        if (response.status === 200) {
            setComment("");
            
            const data2 = {
                locationname: locationname
            }
            const response2 = await fetch("/locationDetail", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data2)
            });

            const message2 = await response2.json();
            const comments = message2.Comments;
            displayComments(comments);
        }
        else if (response.status === 404) {
            setErrorMessage("Failed to add comments")
        }
        else if (response.status === 500) {
            setErrorMessage("Server Error.");
        }
    };
    function displayComments(comments){
        let commentDiv = document.getElementById('comments');
        commentDiv.innerHTML = "";
        for (let i = 0; i < comments.length; i++){
            let displaycomment = document.createElement('div');
            displaycomment.innerHTML = comments[i].User + ": " + comments[i].Comment;
            commentDiv.appendChild(displaycomment);
        }
    }
    useEffect(() => {
        async function fetchData(){
            const response = await fetch('/locationDetail',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({locationname: locationname})
            });
            const data = await response.json();
            const position = {lat: Number(data.Latitude), lng: Number(data.Longitude), title: data.Venue};
            setData(data);
            const comments = data.Comments;
            //displayComments(comments); 
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDjK7VnCQvdaosTOqsNWNp2wgpw8RqOcfY`;
            script.async = true;
            script.defer = true;
            script.addEventListener('load', () => {
                const map = new window.google.maps.Map(mapRef.current, {
                    zoom: 10,
                    center: position,
                });
                new window.google.maps.Marker({
                    position: position,
                    map: map,
                    label: data.Venue,
                });
                displayComments(comments);
            });

            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            }
            return data
        }
        const data = fetchData();
        
    }, []);

    return <>
        <main>{locationname}
        <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
        <table className="event-table">
            <thead>
                <th>Name</th>
                <th>Number of Events</th>
            </thead>
            <tbody id="locationTable">
                <tr>
                    <td>{data.Venue}</td>
                    <td>{data.NumberOfEvents}</td>
                </tr>
            </tbody>
        </table>

        <div id='addComment'>
            Add your comment here:
            <form id="commentform" onSubmit={addComments}>
                <div>
                    <input type="text" id="text" value={comment} onChange={(event) => setComment(event.target.value)}></input>
                </div>
                <div>
                    <button className="btn btn-primary" type="submit" style={{margin: "2px auto"}}>Add</button> 
                </div>
            </form>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </div>
        <br/>
        <div id='comments'></div>
        </main>
    </>
}
