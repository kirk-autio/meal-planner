import React, {Dispatch} from "react";
import {Button, TextField} from "@material-ui/core";
import {AppState} from "../../app/store";
import {login} from "../../app/actions/userActions";
import {connect} from "react-redux";

interface ILoginProps {
    login(username: string, password: string): void;
}

interface ILoginState { 
    username: string;
    password: string;
}

class Login extends React.Component<ILoginProps, ILoginState> {

    constructor(props: Readonly<ILoginProps>) {
        super(props);
        
        this.state = {username: "", password: ""};
    }

    render() {
        return (
            <div className="content" style={{justifyContent: "center"}}>
                <div className="loginForm">
                    <TextField label="Username" value={this.state.username} onChange={e => this.setState({username: e.target.value})} /><br/>
                    <TextField label="Password" value={this.state.password} onChange={e => this.setState({password: e.target.value})} /><br/>

                    <Button color="primary" style={{width: "100%"}} onClick={() => this.props.login(this.state.username, this.state.password)}>Login</Button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        login: (username: string, password: string) => dispatch(login(username, password))
    }
}

const mapStateToProps = (state: AppState) => {
    return {}   
}

export const LoginForm = connect(mapStateToProps, mapDispatchToProps)(Login);