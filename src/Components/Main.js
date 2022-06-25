import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { nanoid } from 'nanoid';
import '../Assets/Styles/main.css';

export default function Main() {
    const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('currentUser'));
    const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('users')).find((e) => e.username === currentUser));

    const [notes, setNotes] = useState(userData.notes);
    const [currentNote, setCurrentNote] = useState((notes && notes[0]) || {});
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData || !currentUser) {
            navigate('/login');
        }
    }, [])

    function signOut() {
        localStorage.removeItem('currentUser');
        navigate('/login');
    }

    function createNewNote(e) {
        const newNote = {
            noteTitle: "Untitled",
            noteBody: "",
            noteID: nanoid()
        }
        setNotes(prevState => {
            return [
                newNote,
                ...prevState,
            ]
        })
        setCurrentNote(newNote);
        setTitle("Untitled");
        setBody("");
    }

    function handleClick(e) {
        let note = notes.find(element => element.noteID === e.target.dataset.noteid);
        setCurrentNote(note);
        setTitle(note.noteTitle);
        setBody(note.noteBody);
    }
    useEffect(() => {
        setCurrentNote(prevState => {
            return {
                ...prevState,
                noteTitle: title,
                noteBody: body
            }
        })
    }, [title, body])

    useEffect(() => {
        setNotes(prevState => {
            return prevState.map(element => element.noteID === currentNote.noteID ? currentNote : element);
        })
    }, [currentNote])

    return (
        <main className="main">
            <div className="left">
                <p className="welcome-message"> Hello <span> {userData.username}! </span> </p>
                <button onClick={createNewNote} className="new-note"> <i className="fa-solid fa-plus"></i> New </button>
                <div className="note-names">
                    <p className="header"> Notes </p>
                    <div className="names-scroll">
                        {notes && notes.map(e => <p onClick={handleClick} data-noteid={e.noteID} name={e.noteTitle} key={nanoid()} placeholder="Untitled" className="noteTitleDiv"> {e.noteTitle} </p>)}
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
                {notes && notes.length > 0 && Object.keys(notes).length > 0 &&
                    <div className="note">
                        <input name="noteTitle" className="note-title" type="text" onChange={e => setTitle(e.target.value)} placeholder="Untitled" value={title || ""} />
                        <textarea name="noteBody" className="note-body" type="text" onChange={e => setBody(e.target.value)} placeholder="Enter your note here..." value={body || ""}> </textarea>
                    </div>
                }
            </div>
        </main>
    )
}