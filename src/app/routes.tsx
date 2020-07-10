import {Router, Route, Switch} from "react-router-dom";
import * as React from "react";
import {LoginForm} from "../features/components/Login";
import {ForgotPassword} from "../features/components/forgotPassword";
import {createBrowserHistory} from "history";

const history = createBrowserHistory();

export default class Routes extends React.Component {

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={LoginForm} />
                    <Route path="/forgotPassword" component={ForgotPassword} />
                </Switch>
                {this.props.children}
            </Router>
        );
    }
}