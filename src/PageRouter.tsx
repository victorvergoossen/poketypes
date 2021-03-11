import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Types from './pages/Types';
import SearchType from './components/SearchType';

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
          <Route
            path="/search"
            component={SearchType}
          />
        </Switch>
      </Router>
    );
  };
}

export default PageRouter;
