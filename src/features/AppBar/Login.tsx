import React, {Dispatch} from "react";
import {Button, TextField, Typography} from "@material-ui/core";
import {AppState} from "../../app/store";
import {login, socialLogin, SocialToken, TokenType} from "../../app/actions/userActions";
import {connect} from "react-redux";
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";

interface ILoginProps {
    error: string;
    login(username: string, password: string): void;
    socialLogin(socialToken: SocialToken): void;
}

interface ILoginState { 
    username: string;
    password: string;
}

class Login extends React.Component<ILoginProps, ILoginState> {

    constructor(props: Readonly<ILoginProps>) {
        super(props);
        
        this.state = {username: "", password: ""};
        
        this.googleSuccess = this.googleSuccess.bind(this);
    }
    
    googleSuccess(googleResponse: GoogleLoginResponse | GoogleLoginResponseOffline) : void {
        const response = googleResponse as GoogleLoginResponse;
        if (response.profileObj === null || response.tokenId === null) return;

        this.props.socialLogin({display: response.profileObj.name, email: response.profileObj.email, profileImage: response.profileObj.imageUrl, accessToken: response.tokenId, tokenType: TokenType.Google});
    }
    
    render() {
        return (
            <div className="content" style={{justifyContent: "center"}}>
                <div className="loginForm">
                    <TextField label="Username" value={this.state.username} onChange={e => this.setState({username: e.target.value})} />
                    <TextField label="Password" value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
                    <Button color="primary" style={{width: "100%"}} onClick={() => this.props.login(this.state.username, this.state.password)}>Login</Button>
                    <Typography variant="caption" className="errorText">{this.props.error}</Typography>
                    <hr ></hr> 
                    <GoogleLogin clientId="814864358844-pm60erbbqtckgfgof0g61f1jh28uftgq.apps.googleusercontent.com" fetchBasicProfile={true} buttonText="Login with Google" onSuccess={this.googleSuccess} onFailure={_ => {}} cookiePolicy={'single_host_origin'} />
                </div> 
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        login: (username: string, password: string) => dispatch(login(username, password)),
        socialLogin: (socialToken: SocialToken) => dispatch(socialLogin(socialToken))
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        error: state.user.error
    }   
}

export const LoginForm = connect(mapStateToProps, mapDispatchToProps)(Login);