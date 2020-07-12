import {Router, Route, Switch} from "react-router-dom";
import * as React from "react";
import {LoginForm} from "../features/components/Login";
import {ForgotPassword} from "../features/components/forgotPassword";
import {PasswordReset} from "../features/components/passwordReset";
import {history} from "./store";
import {Profile} from "../features/components/profile";

export default class Routes extends React.Component {

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={LoginForm} />
                    <Route path="/forgotPassword" component={ForgotPassword} />
                    <Route path="/passwordReset/:id" component={PasswordReset} />
                    <Route path="/profile" component={Profile} />
                </Switch>
                {this.props.children}
            </Router>
        );
    }
}