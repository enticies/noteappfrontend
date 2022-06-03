import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from "./Login";  

function App() {
  return (
    <Router>
      <div className="App">
        <Login />
      </div>
    </Router>
  )
}

export default App;
