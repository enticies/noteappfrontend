import React from 'react';
import { Outlet, useLocation } from "react-router";
import Login from "./Login";


export default function ProtectedRoutes() {
    useLocation();
    const user = localStorage.getItem("currentUser");
    return user ? <Outlet /> : <Login />;
}



