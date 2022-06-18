import React, {useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import '../Assets/Styles/main.css';

export default function Main() {
    const [userData, setUserData] = useState({});
    const [notes, setNotes] = useState(userData.notes);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        const userData = JSON.parse(localStorage.getItem('users')).find((e) => e.username === currentUser)

        if (!userData || !currentUser) {
            navigate('/login');
        }
        setUserData(userData);
        setNotes(userData.notes)
    }, [])

    function signOut() {
        localStorage.removeItem('currentUser');
        navigate('/login');
    }

    function newNote() {
        setNotes(prevState => {
            return [
                ...prevState,
                {
                    noteName: "Untitled",
                    noteBody: "",
                }
            ]
        })
    }

    return (
        <main className="main">
            <div className="left">
                <p className="welcome-message"> Hello <span> {userData.username}! </span> </p>
                <button onClick={newNote} className="new-note"> <i className="fa-solid fa-plus"></i> New </button>
                <div className="note-names">
                    <p className="header"> Notes </p>
                    <div className="names-scroll">
                        {notes && notes.map(e => <div className="noteNameDiv"> {e.noteName} </div>)}
                    </div>
                </div>
                <p className="sign-out" onClick={signOut}> Sign Out </p>
            </div>
            <div className="right">
                {notes && notes.length === 0 &&  
                    <div className="no-notes">
                        <p> You have no notes. </p>     
                    </div>
                }
                {notes && notes.length > 0 &&  Object.keys(notes).length > 0  && 
                    <div className="note">
                        <input className="note-title" type="text" placeholder="Untitled"></input>
                        <textarea className="note-body" type="text" placeholder="Enter your note here..."></textarea>
                    </div>
                }
            </div>
        </main>
    )
}