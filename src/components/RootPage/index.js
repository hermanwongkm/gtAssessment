import React from "react";
import { Route, Switch } from "react-router-dom";

import HomePage from "../HomePage";

export default class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    );
  }
}
