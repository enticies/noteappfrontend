import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import debounce from 'lodash/debounce';
import '../assets/styles/main.css';
import jwt from 'jwt-decode';

export default function Main() {
    const [currentUser, setCurrentUser] = useState("");
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState((notes && notes[0]) || {});
    const [title, setTitle] = useState(
        (currentNote && currentNote.noteTitle) || ""
    );
    const [body, setBody] = useState(
        (currentNote && currentNote.noteBody) || ""
    );
    const navigate = useNavigate();

    const debouncedSave = React.useCallback(
        debounce((notes) => {
        }, 200),
        []
    );

    console.log('heheeeee');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = jwt(token).username;
        setCurrentNote(username);
    }, []);

    function signOut() {
        navigate("/login");
    }

    function createNewNote(e) {
        const newNote = {
            noteTitle: "",
            noteBody: "",
            noteID: nanoid(),
        };
        setCurrentNote(newNote);
        setTitle("");
        setBody("");
        setNotes((prevState) => {
            return [newNote, ...prevState];
        });
    }

    function handleNoteClick(e) {
        let note = notes.find(
            (element) => element.noteID === e.target.dataset.noteid
        );
        setCurrentNote(note);
        setTitle(note.noteTitle);
        setBody(note.noteBody);
        const newNotes = [
            note,
            ...notes.filter((item) => item.noteID !== note.noteID),
        ];
        setNotes(newNotes);
    }

    function handleDeleteClick(e) {
        e.stopPropagation();
        const noteId = e.target.previousSibling.dataset.noteid;
        const newNotes = notes.filter((note) => note.noteID != noteId);
        setNotes(newNotes);
        if (newNotes.length > 0) {
            setCurrentNote(newNotes[0]);
            setTitle(newNotes[0].noteTitle);
            setBody(newNotes[0].noteBody);
        }
    }

    useEffect(() => {
        setCurrentNote((prevState) => {
            return {
                ...prevState,
                noteTitle: title,
                noteBody: body,
            };
        });
    }, [title, body]);

    useEffect(() => {
        setNotes((prevState) => {
            return prevState.map((element) =>
                element.noteID === currentNote.noteID ? currentNote : element
            );
        });
    }, [currentNote]);

    useEffect(() => debouncedSave(notes), [notes]);
    return (
        <main className="main">
            <div className="left">
                <p className="welcome-message">
                    {" "}
                    Hello <span> {currentUser}! </span>{" "}
                </p>
                <button onClick={createNewNote} className="new-note">
                    {" "}
                    <i className="fa-solid fa-plus"></i> New{" "}
                </button>
                <div className="note-names">
                    <p className="header"> Notes </p>
                    <div className="names-scroll">
                        {notes &&
                            notes.map((e) => (
                                <div
                                    className="noteTitleDiv"
                                    onClick={handleNoteClick}
                                    key={nanoid()}
                                >
                                    <input
                                        className="title"
                                        type="button"
                                        data-noteid={e.noteID}
                                        name={e.noteTitle}
                                        key={nanoid()}
                                        value={e.noteTitle || "Untitled"}
                                    ></input>
                                    <i
                                        onClick={handleDeleteClick}
                                        className="fa-solid fa-trash"
                                    ></i>
                                </div>
                            ))}
                    </div>
                </div>
                <p className="sign-out" onClick={signOut}>
                    {" "}
                    Sign Out{" "}
                </p>
            </div>
            <div className="right">
                {notes && notes.length === 0 && (
                    <div className="no-notes">
                        <p> You have no notes. </p>
                    </div>
                )}
                {notes && notes.length > 0 && Object.keys(notes).length > 0 && (
                    <div className="note">
                        <input
                            name="noteTitle"
                            className="note-title"
                            type="text"
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Untitled"
                            value={title || ""}
                        />
                        <textarea
                            name="noteBody"
                            className="note-body"
                            type="text"
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Enter your note here..."
                            value={body || ""}
                        >
                            {" "}
                        </textarea>
                    </div>
                )}
            </div>
        </main>
    );
}
