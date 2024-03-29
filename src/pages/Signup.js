import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/access.css';

export default function Signup() {
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

        if (inputs.password !== inputs.confirmPassword) {
            errorOutput.textContent = 'Passwords do not match.';
            return;
        }

        axios.post(process.env.REACT_APP_API_URL + '/register', {
                username: inputs.username,
                password: inputs.password,
            })
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    console.log('here');
                    navigate('/');
                }
                errorOutput.textContent = genericErrorMessage;
            })
            .catch((error) => {
                console.log(error);
            });

    };

    return (
        <div className='signup'>
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
                <input
                    required
                    type='password'
                    name='confirmPassword'
                    placeholder='Confirm Password'
                    value={inputs.confirmPassword || ''}
                    onChange={handleChange}
                ></input>
                <p className='error-output'> </p>
                <button> Sign Up </button>
                <p className='question'>
                    {' '}
                    Have an account?{' '}
                    <Link className='login-text' to='/'>
                        {' '}
                        Log In{' '}
                    </Link>
                </p>
            </form>
        </div>
    );
}
