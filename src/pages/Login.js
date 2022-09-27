import React, { useState, useEffect } from "react";
import "../assets/styles/access.css";
import { Link, useNavigate } from "react-router-dom";

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
        const errorOutput = document.getElementsByClassName("error-output")[0];
        const genericErrorMessage = "Something went wrong.";
        errorOutput.textContent = "";

        fetch(process.env.REACT_APP_API_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: inputs.username,
                password: inputs.password,
            }),
            credentials: "include",
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else {
                    errorOutput.textContent = genericErrorMessage;
                }
            })
            .then((data) => {
                localStorage.setItem("accessToken", data.accessToken);
                navigate("/main");
            })
            .catch((error) => {
                errorOutput.textContent = genericErrorMessage;
                console.error("Error:", error);
            });
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <input
                    required
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={inputs.username || ""}
                    onChange={handleChange}
                ></input>
                <input
                    required
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={inputs.password || ""}
                    onChange={handleChange}
                ></input>
                <p className="error-output"> </p>
                <button> Login </button>
                <p className="question">
                    {" "}
                    Don't have an account?{" "}
                    <Link className="signup-text" to="/signup">
                        {" "}
                        Sign Up{" "}
                    </Link>
                </p>
            </form>
        </div>
    );
}
