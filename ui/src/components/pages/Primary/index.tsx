import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RoomPage from './content/Room';
import SearchPage from './content/Search';
import Header from './Header';

const Content: React.FunctionComponent = () => {
  return (
    <>
      <Header />
      <div id="content">
        <Switch>
          <Route path="/room/:roomId" component={RoomPage} />
          <Route path="/search" component={SearchPage} />
        </Switch>
      </div>
    </>
  );
};

export default Content;
