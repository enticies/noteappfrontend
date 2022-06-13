import React, {useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import '../Assets/Styles/main.css';

export default function Main() {
    const [currentUser, setCurrentUser] = useState({});
    const state = useLocation();
    console.log(state);

    
    useEffect(() => {
        const userData = localStorage.getItem('currentUser');
        const currentUser = JSON.parse(localStorage.getItem('users')).find((e) => e.username == userData)
        setCurrentUser(currentUser);
    }, [])
    return (
        <main className="main">
            <div className="note-names">
                {/* <p className="welcome-message"> Hello <span> {currentUser.username}! </span> </p> */}
            </div>
            <div className="note-bodies">
            </div>
        </main>
    )
}