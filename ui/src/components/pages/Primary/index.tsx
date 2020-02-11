import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SearchPage from './content/Search';
import Header from './Header';

const Content: React.FunctionComponent = () => {
  return (
    <>
      <Header />
      <div id="content">
        <Switch>
          <Route path="/search" component={SearchPage} />
        </Switch>
      </div>
    </>
  );
};

export default Content;
