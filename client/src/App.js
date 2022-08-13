import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import CreationPage from './components/CreationPage';
import Notification from './components/Notification';
import NotificationContext from './NotificationContext';
import logo from './navlogo.svg';

const App = () => {
  const [notification, setNotification] = useState(null);

  const notificationObj = { notification, setNotification };

  return (
    <div>
      <NotificationContext.Provider value={notificationObj}>
        <BrowserRouter>
          <nav className="navbar navbar-light bg-light">
            <div className="container-fluid justify-content-center">
              <Link to="/" className="navbar-brand">
                <img src={logo} alt="logo" width="128" height="64" />
              </Link>
            </div>
          </nav>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route
              exact
              path="/quiz/:id"
              render={(props) => (
                <Quiz key={props.match.params.id} {...props} />
              )}
            />
            <Route exact path="/create-quiz">
              <CreationPage />
            </Route>
            <Route>
              <div className="mt-3 text-center">
                <h1>404 Not found</h1>
              </div>
            </Route>
          </Switch>
        </BrowserRouter>
        <Notification />
      </NotificationContext.Provider>
    </div>
  );
};

export default App;
