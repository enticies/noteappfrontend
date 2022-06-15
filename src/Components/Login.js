import React, { useState, useEffect } from 'react';
import "../Assets/Styles/access.css";
import { Link, useNavigate } from "react-router-dom";
import Main from "./Main";

export default function Login() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
    }

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const users = JSON.parse(localStorage.getItem('users'));

        if (user && users.find(e => e.username = user)) {
            navigate('/');
        }
    }, [])

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(prevState => {
            return {
                ...prevState,
                [name]: value,
            }
        })

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        document.getElementsByClassName("error-output")[0].textContent = "";

        const users = JSON.parse(localStorage.getItem("users"));
        const user = users.find((user) => user.username === inputs.username);

        if (user === undefined) {
            document.getElementsByClassName("error-output")[0].textContent = `Username "${inputs.username}" doesn't exist!`;
            return;
        }
        if (user !== undefined && user.password !== inputs.password) {
            document.getElementsByClassName("error-output")[0].textContent = "Wrong password!"
            return;
        }
        localStorage.setItem("currentUser", inputs.username);
        console.log("DSA");
        navigate('/');
    }


    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <input required type="text" name="username" placeholder="Username" value={inputs.username || ""} onChange={handleChange}></input>
                <input required type="text" name="password" placeholder="Password" value={inputs.password || ""} onChange={handleChange}></input>
                <p className="error-output"> </p>
                <button> Login </button>
                <p className="question"> Don't have an account? <Link className="signup-text" to="/signup"> Sign Up </Link></p>
            </form>
        </div>
    )
}