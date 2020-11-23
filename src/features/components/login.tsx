import React, {Dispatch} from "react";
import {Button, CircularProgress, TextField, Typography} from "@material-ui/core";
import {AppState} from "../../app/store";
import {login, socialLogin, SocialToken, TokenType} from "../../app/actions/userActions";
import {connect} from "react-redux";
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";
import {Redirect} from "react-router-dom";
import CommonComponent, {ICommonProps, ICommonState} from "../BaseComponent";
import {loggedOutUser, MessageType} from "../../app/state/userState";

interface ILoginProps extends ICommonProps {
    googleClient: string;
    isLoggedIn: boolean;
    loading: boolean;
    error: string;
    login(username: string, password: string): void;
    socialLogin(socialToken: SocialToken): void;
}

interface ILoginState extends ICommonState { 
    username: string;
    password: string;
}

class Login extends CommonComponent<ILoginProps, ILoginState> {

    constructor(props: Readonly<ILoginProps>) {
        super(props);
        
        this.state = {username: "", password: ""};
        
        this.googleSuccess = this.googleSuccess.bind(this);
        this.standardLogin = this.standardLogin.bind(this);
    }
    
    googleSuccess(googleResponse: GoogleLoginResponse | GoogleLoginResponseOffline) : void {
        const response = googleResponse as GoogleLoginResponse;
        if (response.profileObj === null || response.tokenId === null) return;

        this.props.socialLogin({display: response.profileObj.name, email: response.profileObj.email, profileImage: response.profileObj.imageUrl, accessToken: response.tokenId, tokenType: TokenType.Google});
    }
    
    standardLogin(event: React.MouseEvent) {
        event.preventDefault();
        this.props.login(this.state.username, this.state.password);
    }
    
    contents() {
        if (this.props.isLoggedIn) 
            return <Redirect to="/" />;
        if (this.props.loading === true)
            return (<CircularProgress />);
        
        return (
            <div className="content" style={{flexFlow: "column"}}>
                <div style={{display: "flex", flexGrow: 1, justifyContent: "center"}}>
                    <form>
                    <div className="loginForm">
                        <TextField label="Username" value={this.state.username} onChange={e => this.setState({username: e.target.value})} />
                        <TextField label="Passwords" type="password" value={this.state.password}  onChange={e => this.setState({password: e.target.value})} />
                        <Button color="primary" type="submit" variant={"contained"} style={{width: "100%", marginTop: "10px"}} onClick={this.standardLogin}>Login</Button>
                        <Button size={"small"} variant={"text"} onClick={() => this.props.history.push("/forgotPassword")}>Forgot Password</Button>
                    </div>
                    </form>
                    <div><hr style={{height: "100%", marginLeft: "1em", marginRight: "1em"}} /></div>  
                    <div style={{alignSelf: "center", display: "flex", flexFlow: "column"}}>
                        <GoogleLogin clientId={this.props.googleClient} theme={"dark"} fetchBasicProfile={true} buttonText="Login with Google" onSuccess={this.googleSuccess} onFailure={e => console.log(e)} cookiePolicy={'single_host_origin'} />
                        <Button color="primary" variant="text" onClick={() => this.props.history.push("/register")}>Create New User</Button>
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "center", marginTop: "1em"}}>
                    <Typography variant="caption" className="errorText">{this.props.error}</Typography>
                </div>
            </div>);
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
        googleClient: "814864358844-pm60erbbqtckgfgof0g61f1jh28uftgq.apps.googleusercontent.com",
        loading: state.user.loading,
        isLoggedIn: state.user.token !== loggedOutUser.token,
        error: state.user.message.getMessageFor(MessageType.Login)
    }   
}

export const LoginForm = connect(mapStateToProps, mapDispatchToProps)(Login); 