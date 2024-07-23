//Home page for users 
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getCookie } from '../Visitor/CookieHandlers';
import { useNavigate } from "react-router";

export default function UserHome(){
    const [username, setUsername] = useState(getCookie("username"));
    const [data, setData] = useState({});
    const navigate = useNavigate();

    const mapRef = useRef(null);
    
    useEffect(() => {
        fetch('/location',{method: 'POST'})
        .then((response) => response.json())
        .then((data) => {
            data = JSON.parse(data);
            const locations = Object.keys(data).map((locationId) => {
                const location = data[locationId];
                const title = location.Venue;
                const lat = Number(location.Latitude);
                const lng = Number(location.Longitude);
                return { title, lat, lng };
            });
            setData(locations); 
        })
       
    },[])
    
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDjK7VnCQvdaosTOqsNWNp2wgpw8RqOcfY`;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', () => {
            const map = new window.google.maps.Map(mapRef.current, {
                zoom: 10,
                center: data[0]
            });

            data.forEach(location => {
                const marker = new window.google.maps.Marker({
                    position: location,
                    map: map,
                    label: location.title
                });

                window.google.maps.event.addListener(marker, 'click', () =>{
                    navigate(`/profile/location/${location.title}`);
                });
            });
        });

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [data]);

    return <>
        <main>
            <h1>Home for {username}</h1>
        <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
        </main>
    </>
    }