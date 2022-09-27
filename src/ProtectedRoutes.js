import React from 'react';
import { Outlet, useLocation } from "react-router";
import Login from "./pages/Login";
import jwt_decode from "jwt-decode";
 


export default function ProtectedRoutes() {
    const token = localStorage.getItem("accessToken");
    return token ? <Outlet /> : <Login />;
}



