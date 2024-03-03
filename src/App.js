import './App.css';
import MotionBackground from './Components/MotionBg';
import Auth from './Pages/Authentication';
import Home from './Pages/Home';
import Privateroute from './Route/privateRoute';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


function App() {
  return (
    <>
      <MotionBackground />
      <Router>
        <Switch>
          {/* <Privateroute exact path="/" component={Profile} /> */}
          <Privateroute exact path="/" component={Home} />
          <Route exact path="/login" component={Auth} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
