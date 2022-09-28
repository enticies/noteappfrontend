import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import debounce from 'lodash/debounce';
import '../assets/styles/main.css';
import jwt from 'jwt-decode';

export default function Main() {
    const [currentUser, setCurrentUser] = useState('');
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [title, setTitle] = useState((currentNote && currentNote.noteTitle) || '');
    const [body, setBody] = useState((currentNote && currentNote.noteBody) || '');
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        setAccessToken(localStorage.getItem('accessToken'));
        console.log('ffff');
    }, []);

    const debouncedSave = React.useCallback(
        debounce((note, accessToken) => {
            if (!note || !accessToken) {
                return;
            }
            console.log('ddd');
            const body = {
                id: note._id,
                title: note.title,
                body: note.body,
            };
            fetch(process.env.REACT_APP_API_URL + '/updatenote', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken,
                },
                credentials: 'include',
                body: JSON.stringify(body),
            })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }, 500),
        []
    );

    useEffect(() => {
        try {
            setCurrentUser(jwt(accessToken).UserInfo.username);
        } catch (err) {
            // request new token with a refresh token here
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            fetch(process.env.REACT_APP_API_URL + '/getusernotes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken,
                },
                credentials: 'include',
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setNotes(data);
                    if (notes) {
                        setCurrentNote(data[0]);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [accessToken]);

    const createNewNote = (e) => {
        fetch(process.env.REACT_APP_API_URL + '/createnote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken,
            },
            credentials: 'include',
        })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                setCurrentNote(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setTitle('');
        setBody('');
        setNotes((prevState) => {
            return [currentNote, ...prevState];
        });
    };

    const handleNoteClick = (e) => {
        let note = notes.find((element) => element._id === e.target.dataset.id);
        setCurrentNote(note);
        setTitle(note.title);
        setBody(note.body);
        const newNotes = [note, ...notes.filter((item) => item._id !== note._id)];
        setNotes(newNotes);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const id = e.target.previousSibling.dataset.id;
        console.log(id);
        fetch(process.env.REACT_APP_API_URL + '/deletenote', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken,
            },
            credentials: 'include',
            body: JSON.stringify({
                'id': id,
            }),
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    setNotes(notes.filter((note) => note._id != id));
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        if (notes.length > 0) {
            setCurrentNote(notes[0]);
            setTitle(notes[0].noteTitle);
            setBody(notes[0].noteBody);
        }
    };

    const signOut = () => {};

    useEffect(() => {
        setCurrentNote((prevState) => {
            return {
                ...prevState,
                title: title,
                body: body,
            };
        });
    }, [title, body]);

    useEffect(() => {
        debouncedSave(currentNote, accessToken);
    }, [currentNote]);

    useEffect(() => {
        setNotes((prevState) => {
            return prevState.map((element) =>
                element._id === currentNote._id ? currentNote : element
            );
        });
    }, [currentNote]);

    return (
        <main className='main'>
            <div className='left'>
                <p className='welcome-message'>
                    {' '}
                    Hello <span> {currentUser}! </span>{' '}
                </p>
                <button onClick={createNewNote} className='new-note'>
                    {' '}
                    <i className='fa-solid fa-plus'></i> New{' '}
                </button>
                <div className='note-names'>
                    <p className='header'> Notes </p>
                    <div className='names-scroll'>
                        {notes &&
                            notes.map((e) => (
                                <div
                                    className='noteTitleDiv'
                                    onClick={handleNoteClick}
                                    key={nanoid()}
                                >
                                    <input
                                        className='title'
                                        type='button'
                                        data-id={e._id}
                                        name={e.title}
                                        key={nanoid()}
                                        value={e.title || 'Untitled'}
                                    ></input>
                                    <i
                                        onClick={handleDeleteClick}
                                        className='fa-solid fa-trash'
                                    ></i>
                                </div>
                            ))}
                    </div>
                </div>
                <p className='sign-out' onClick={signOut}>
                    {' '}
                    Sign Out{' '}
                </p>
            </div>
            <div className='right'>
                {notes && notes.length === 0 && (
                    <div className='no-notes'>
                        <p> You have no notes. </p>
                    </div>
                )}
                {notes && notes.length > 0 && Object.keys(notes).length > 0 && (
                    <div className='note'>
                        <input
                            name='noteTitle'
                            className='note-title'
                            type='text'
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Untitled'
                            value={title || ''}
                        />
                        <textarea
                            name='noteBody'
                            className='note-body'
                            type='text'
                            onChange={(e) => setBody(e.target.value)}
                            placeholder='Enter your note here...'
                            value={body || ''}
                        >
                            {' '}
                        </textarea>
                    </div>
                )}
            </div>
        </main>
    );
}
