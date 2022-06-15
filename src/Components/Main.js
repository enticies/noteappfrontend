import React, {useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from "react-router-dom"
import '../Assets/Styles/main.css';

export default function Main() {
    const [currentUser, setCurrentUser] = useState({});

    const navigate = useNavigate();
    
    useEffect(() => {
        const userData = localStorage.getItem('currentUser');
        const currentUser = JSON.parse(localStorage.getItem('users')).find((e) => e.username == userData)
        if (!userData) {
            navigate('/login');
        }
        setCurrentUser(currentUser);
    }, [])
    return (
        <main className="main">
            <div className="note-names">
                <p className="welcome-message"> Hello <span> {currentUser.username}! </span> </p>
            </div>
            <div className="note-bodies">
            </div>
        </main>
    )
}