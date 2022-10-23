import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/error404.css'

// TODO: Make this component more robust by showing more errors. 

export default function Error404() {
    return (
        <div className="error404">
            <p className="number"> 404 </p>
            <p className="text"> Page Not Found </p>
            <Link to="/"> <p className="question"> Return <span> Home? </span> </p> </Link>
        </div>

    )
}