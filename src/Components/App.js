import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login";
import Signup from "./Signup";
import Main from "./Main";
import Error404 from "./Error404";
import ProtectedRoutes from './ProtectedRoutes';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route  element={<ProtectedRoutes />}>
            <Route path="/" index exact element={<Main />} />
          </Route>
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="*" exact element={<Error404 />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
