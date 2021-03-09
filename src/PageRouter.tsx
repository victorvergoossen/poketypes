import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Types from './pages/Types';

class PageRouter extends React.Component {
  render() {
    return (
      /* PageRouter added for future functionality */
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            component={Types}
          />
        </Switch>
      </Router>
    );
  };
}

export default PageRouter;
