import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import Error404 from "./pages/Error404";
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
