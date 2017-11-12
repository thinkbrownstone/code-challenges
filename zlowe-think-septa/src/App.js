import React, { Component } from 'react';
import Navi from './Nav';
import SeptaForm from './SeptaForm';
import HelperText from './HelperText';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PropsRoute, PublicRoute, PrivateRoute } from 'react-router-with-props';

class App extends Component {
  render() {
    return (
      <div className="App">
      <Navi />
      <Router>
      <div>
      <PropsRoute exact path="/" component={SeptaForm}/>
      <PropsRoute exact path="/help" component={HelperText}/>
      </div>
  </Router>
      </div>
    );
  }
}

export default App;
