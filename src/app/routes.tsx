import {Router, Route, Switch} from "react-router-dom";
import * as React from "react";
import {LoginForm} from "../features/components/login";
import {ForgotPassword} from "../features/components/forgotPassword";
import {PasswordReset} from "../features/components/passwordReset";
import {history} from "./store";
import {Profile} from "../features/components/profile";
import {VerifyLogin} from "../features/components/verifyLogin";
import {Register} from "../features/components/register";

export default class Routes extends React.Component {

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={LoginForm} />
                    <Route path="/forgotPassword" component={ForgotPassword} />
                    <Route path="/passwordReset/:id" component={PasswordReset} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/verify/:id" component={VerifyLogin} />
                    <Route path="/register" component={Register} />
                </Switch>
                {this.props.children}
            </Router>
        );
    }
}