import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "../Assets/Styles/access.css";

export default function Signup() {
    const [inputs, setInputs] = useState({});

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
        document.getElementsByClassName("error-output")[0].textContent = ""
        if (!localStorage.getItem("users")) {
            localStorage.setItem("users", JSON.stringify([]));
        }

        if (inputs.password !== inputs.confirmPassword) {
            document.getElementsByClassName("error-output")[0].textContent = "Passwords do not match."
            return;
        }

        const users = JSON.parse(localStorage.getItem("users"));
        for (let user of users) {
            if (user.username === inputs.username) {
                document.getElementsByClassName("error-output")[0].textContent = `Username "${inputs.username}" already exists.`;
                return;
            }
        }

        users.push({
            username: inputs.username,
            password: inputs.password,
            notes: {}
        });
        localStorage.setItem("users", JSON.stringify(users));
    }

    return (
        <div className="signup">
            <form onSubmit={handleSubmit}>
                <input required type="text" name="username" placeholder="Username" value={inputs.username || ""} onChange={handleChange}></input>
                <input required type="text" name="password" placeholder="Password" value={inputs.password || ""} onChange={handleChange}></input>
                <input required type="text" name="confirmPassword" placeholder="Confirm Password" value={inputs.confirmPassword || ""} onChange={handleChange}></input>
                <p className="error-output"> </p>
                <button> Sign Up </button>
                <p className="question"> Have an account? <Link className="login-text" to="/"> Log In </Link></p>
            </form>
        </div>
    )
}