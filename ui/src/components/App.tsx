import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import FrontPage from './pages/Front';
import PrimaryPage from './pages/Primary';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={FrontPage} />
        <Route component={PrimaryPage} />
      </Switch>
    </Router>
  );
};

export default App;
