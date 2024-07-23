import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import VisitorPage from './Visitor/VisitorPage';
import UserPage from './UserAndAdmin/UserPage';
import Location from './UserAndAdmin/Location';
import UserLocation from './UserAndAdmin/UserLocation';
import UserEvent from './UserAndAdmin/UserEvent';
import UserHome from './UserAndAdmin/UserHome';
import AdminHome from './UserAndAdmin/AdminHome';
import AdminUser from './UserAndAdmin/AdminUser';
import AdminEvent from './UserAndAdmin/AdminEvent';
import RootPage from './UserAndAdmin/RootPage';
import UserFavorite from './UserAndAdmin/UserFavorite';

const RoutesDef = () => {
  return (
		<Routes>
      <Route path="/" element={<VisitorPage/>}/> 
      <Route path="profile" element={<UserPage/>}>
        <Route index element={<RootPage/>} />
        <Route path="user" element={<AdminUser/>} />
        <Route path="adminevent" element={<AdminEvent/>} />
        <Route path="adminhome" element={<AdminHome/>} />
        <Route path="home" element={<UserHome/>} />
        <Route path="event" element={<UserEvent/>} />
        <Route path="favorite" element={<UserFavorite/>} />
        <Route path="location" element={<UserLocation/>}/>
        <Route path="location/:locationname" element={<Location/>}/>
      </Route>
    </Routes>
  );
};

export default RoutesDef;
