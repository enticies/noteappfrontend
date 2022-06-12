import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import '../Assets/Styles/error404.css'

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