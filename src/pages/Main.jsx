import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import debounce from 'lodash/debounce';
import '../assets/styles/main.css';
import { isJwtExpired } from 'jwt-check-expiration';
import axios from 'axios';

export default function Main() {
    const [currentUser, setCurrentUser] = useState('');
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [title, setTitle] = useState((currentNote && currentNote.noteTitle) || '');
    const [body, setBody] = useState((currentNote && currentNote.noteBody) || '');
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState('');

    const privateAxios = axios.create();
    const refreshAxios = axios.create();

    useEffect(() => {
        setAccessToken(localStorage.getItem('accessToken'));
    }, []);

    privateAxios.interceptors.request.use(async (req) => {
        const isExpired = isJwtExpired(accessToken);
        if (!isExpired) {
            return req;
        }
        const newToken = await getNewAccessToken();
        setAccessToken(newToken);
        localStorage.setItem('accessToken', newToken);
        req.headers.Authorization = `Bearer ${newToken}`;
        return req;
    });

    const getNewAccessToken = async () => {
        const accessTokenObj = await refreshAxios
            .get(process.env.REACT_APP_API_URL + '/refreshtoken', {
                withCredentials: true,
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
        if (!accessTokenObj) {
            handleLogout();
        } else {
            return accessTokenObj.accessToken;
        }
    };
    const debouncedSave = React.useCallback(
        debounce((note, accessToken) => {
            if (!note || !accessToken) {
                return;
            }
            const body = JSON.stringify({
                id: note._id,
                title: note.title,
                body: note.body,
            });
            privateAxios
                .put(process.env.REACT_APP_API_URL + '/updatenote', body, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken,
                    },
                })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }, 500),
        []
    );

    useEffect(() => {
        if (accessToken) {
            privateAxios
                .get(process.env.REACT_APP_API_URL + '/getusernotes', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken,
                    },
                    withCredentials: true,
                })
                .then((response) => {
                    setNotes(response.data);
                    if (response.data[0]) {
                        setCurrentNote(response.data[0]);
                        setTitle(response.data[0].title);
                        setBody(response.data[0].body);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [accessToken]);

    const createNewNote = (e) => {
        privateAxios
            .post(
                process.env.REACT_APP_API_URL + '/createnote',
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            )
            .then((response) => {
                if (response.status === 201) {
                    setCurrentNote(response.data);
                    setTitle('');
                    setBody('');
                    setNotes((prevState) => {
                        return [response.data, ...prevState];
                    });
                }
            })
            .catch((error) => {
                console.log(error);
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
        privateAxios
            .delete(process.env.REACT_APP_API_URL + '/deletenote', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken,
                },
                data: {
                    id: id,
                },
            })
            .then((response) => {
                if (response.status === 204) {
                    const newNotes = notes.filter((note) => note._id !== id);
                    setNotes(newNotes);
                    if (newNotes.length > 0) {
                        setCurrentNote(newNotes[0]);
                        setTitle(newNotes[0].title);
                        setBody(newNotes[0].body);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleLogout = async () => {
        await privateAxios
            .post(
                process.env.REACT_APP_API_URL + '/logout',
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            )
            .catch((error) => {
                console.log(error);
            });
        localStorage.removeItem('accessToken');
        navigate('/');
    };

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
        const note = notes.find((n) => n._id === currentNote._id);
        if (
            note &&
            currentNote &&
            (note.title !== currentNote.title || note.body !== currentNote.body)
        ) {
            debouncedSave(currentNote, accessToken);
        }
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
                            notes.map((note) => (
                                <div
                                    className='noteTitleDiv'
                                    onClick={handleNoteClick}
                                    key={nanoid()}
                                >
                                    <input
                                        className='title'
                                        type='button'
                                        data-id={note._id}
                                        name={note.title}
                                        key={nanoid()}
                                        value={note.title || 'Untitled'}
                                    ></input>
                                    <i
                                        onClick={handleDeleteClick}
                                        className='fa-solid fa-trash'
                                    ></i>
                                </div>
                            ))}
                    </div>
                </div>
                <p className='sign-out' onClick={handleLogout}>
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
