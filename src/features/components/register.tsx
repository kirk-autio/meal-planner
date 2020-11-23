import CommonComponent, {ICommonProps, ICommonState} from "../BaseComponent";
import React, {Dispatch} from "react";
import {AppState} from "../../app/store";
import {connect} from "react-redux";
import {IUserState, loggedOutUser, MessageType, UserState} from "../../app/state/userState";
import {createNew} from "../../app/actions/userActions";
import {Button, CircularProgress, TextField, Typography} from "@material-ui/core";

interface IState extends ICommonState {
    displayName: string;
    email: string;
    username: string;
    password: string;
}

interface IProps extends ICommonProps {
    loading: boolean;
    validate: boolean;
    error: string;
    register(user: IUserState, username: string, password: string): void;
}

class register extends CommonComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
        
        this.state = {displayName: "", email: "", username: "", password: ""};
        this.registerUser = this.registerUser.bind(this);
    }

    registerUser(event: React.MouseEvent) {
        event.preventDefault();
        this.props.register(new UserState("", this.state.displayName, this.state.email), this.state.username, this.state.password);
    }
    
    contents(): JSX.Element {
        if (this.props.validate)
            return (
                <div style={{display: "flex", justifyContent: "center", marginTop: "1em"}}>
                    <Typography variant="caption">{this.props.error}</Typography>
                </div>
            );
        
        if (this.props.loading) 
            return (<CircularProgress />);
        
        return (
            <form>
                <div className="content" style={{border: "1px", borderColor: "primary", borderBlock: "thick"}}>
                    <div style={{display: "flex", flexFlow: "column", alignItems: "center"}}>
                      <TextField variant="standard" label="Username" value={this.state.username} onChange={e => this.setState({username: e.target.value})} />
                      <TextField variant="standard" type="password" label="Password" value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
                    </div>
                    <div style={{marginLeft: "1em", marginRight: "1em"}}><hr style={{height: "100%"}} /></div>
                    <div style={{display: "flex", flexFlow: "column"}}>
                        <TextField variant="standard" label="Display Name" value={this.state.displayName} onChange={e => this.setState({displayName: e.target.value})} />
                        <TextField variant="standard" label="Email" inputMode="email" value={this.state.email} onChange={e => this.setState({email: e.target.value})} /> 
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "center", marginTop: "1em"}}>                
                    <Button type="submit" variant={"contained"} onClick={this.registerUser}>Register</Button>
                </div>
                <div style={{display: "flex", justifyContent: "center", marginTop: "1em"}}>
                    <Typography variant="caption" className="errorText">{this.props.error}</Typography>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        loading: state.user.loading,
        error: state.user.message.getMessageFor(MessageType.Registration),
        validate: state.user.token !== loggedOutUser.token && !state.user.verified
    };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        register: (user: IUserState, username: string, password: string) => dispatch(createNew(user, username, password))
    };
}

export const Register = connect(mapStateToProps, mapDispatchToProps)(register);