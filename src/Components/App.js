import React  from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login";  
import Signup from "./Signup";  
import Main from "./Main";  
import Error404 from "./Error404";  

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> 
          <Route path="/" index exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/main" exact element={<Main />}/>
          <Route path="*" exact element={<Error404 />}/>
        </Routes> 
      </div>
    </Router>
  )
}

export default App;
