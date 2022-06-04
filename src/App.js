import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from "./Login";  
import Signup from "./Signup";  

function App() {
  return (
    <Router>
      <div className="App">
        <Switch> 
          <Route path="/" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
        </Switch> 
      </div>
    </Router>
  )
}

export default App;
