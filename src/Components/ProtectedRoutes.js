import React from 'react';
import { Outlet } from "react-router";
import Login from "./Login";

const useAuth = () => {
    const user = localStorage.getItem("currentUser");
    return user !== null;
}

export default function ProtectedRoutes() {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Login />;
}



