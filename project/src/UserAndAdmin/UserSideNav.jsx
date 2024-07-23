// Side navbar for Users
import React, { useContext, useEffect } from 'react';
import {Link} from 'react-router-dom';
import "./sidenav.css"

export default function UserSideNav(){
    return (
        <nav className="vertical-navbar">
          <ul>
            <li>
                <Link to="/profile/home" style={{ textDecoration: 'none' }}>
                  <button>Home</button>
                </Link>
            </li>
            <li>
                <Link to="/profile/event" style={{ textDecoration: 'none' }}>
                  <button>Event</button>
                </Link>
            </li>
            <li>
                <Link to="/profile/location" style={{ textDecoration: 'none' }}>
                  <button>Location</button>
                </Link>
            </li>
            <li>
                <Link to="/profile/favorite" style={{ textDecoration: 'none' }}>
                  <button>Favorite</button>
                </Link>
            </li>
          </ul>
        </nav>
      );
}