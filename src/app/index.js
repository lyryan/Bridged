/* eslint-disable */

import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import About from './pages/About.js';
import Campaigns from './pages/Campaigns'
import Home from './pages/Home'

export default class App extends React.Component {
  render() {
    return (
      <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/campaigns">Campaigns</Link>
            </li>
          </ul>
        </nav>
        {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/campaigns">
            <Campaigns />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        </div>
        </Router>
    );
  }
}
