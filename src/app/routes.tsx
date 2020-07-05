import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import * as React from "react";
import {LoginForm} from "../features/AppBar/Login";

export const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={LoginForm} />
            </Switch>
        </Router>
    );
}