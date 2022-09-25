import React from 'react';
import { Outlet, useLocation } from "react-router";
import Login from "./pages/Login";
import jwt_decode from "jwt-decode";
 


export default function ProtectedRoutes() {
    useLocation();
    let username = null;
    const token = localStorage.getItem("accessToken");
    if (token) {
        username = jwt_decode(token).username;
    }
    return username ? <Outlet /> : <Login />;
}



