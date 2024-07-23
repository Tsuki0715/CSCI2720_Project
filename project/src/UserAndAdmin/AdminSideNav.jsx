// Side navbar for Users
import React from 'react';
import {Link} from 'react-router-dom';
import "./sidenav.css"
export default function AdminSideNav(){

    return (
        <nav className="vertical-navbar">
          <ul>
            <li>
                <Link to="/profile/adminhome" style={{ textDecoration: 'none' }}>
                  <button>Home</button>
                </Link>
            </li>
            <li>
                <Link to="/profile/adminevent" style={{ textDecoration: 'none' }}>
                  <button>Event Change</button>
                </Link>
            </li>
            <li>
                <Link to="/profile/user" style={{ textDecoration: 'none' }}>
                  <button>User Change</button>
                </Link>
            </li>
          </ul>
        </nav>
      );
}