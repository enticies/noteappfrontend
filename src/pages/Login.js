import React, { useState, useEffect } from 'react';
import '../assets/styles/access.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errorOutput = document.getElementsByClassName('error-output')[0];
        const genericErrorMessage = 'Something went wrong.';
        errorOutput.textContent = '';

        axios.post(process.env.REACT_APP_API_URL + '/login', {
                username: inputs.username,
                password: inputs.password,
            },
            {
                withCredentials: true
            })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    navigate('/main');
                }
                errorOutput.textContent = genericErrorMessage;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className='login'>
            <form onSubmit={handleSubmit}>
                <input
                    required
                    type='text'
                    name='username'
                    placeholder='Username'
                    value={inputs.username || ''}
                    onChange={handleChange}
                ></input>
                <input
                    required
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={inputs.password || ''}
                    onChange={handleChange}
                ></input>
                <p className='error-output'> </p>
                <button> Login </button>
                <p className='question'>
                    {' '}
                    Don't have an account?{' '}
                    <Link className='signup-text' to='/signup'>
                        {' '}
                        Sign Up{' '}
                    </Link>
                </p>
            </form>
        </div>
    );
}
