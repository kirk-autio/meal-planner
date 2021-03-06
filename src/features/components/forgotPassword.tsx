﻿import React, {Dispatch} from "react";
import {AppState} from "../../app/store";
import {connect} from "react-redux";
import {Button, TextField, Typography} from "@material-ui/core";
import CommonComponent, {ICommonProps, ICommonState} from "../BaseComponent";
import {forgotPassword} from "../../app/actions/userActions";
import * as validator from "email-validator";

interface IProps extends ICommonProps {
    resetPassword(email: string): void;
}

interface IState extends ICommonState {
    email: string;
    message: string;
}

class forgotPasswordForm extends CommonComponent<IProps, IState> {
    
    constructor(props: IProps) {
        super(props);
        
        this.state = {email: "", message: ""};
        this.sendPasswordReset = this.sendPasswordReset.bind(this);
    }
    
    sendPasswordReset(event: React.MouseEvent) {
        event.preventDefault();
        this.props.resetPassword(this.state.email);
        this.setState({message: "You should get an email shortly with instructions on how to reset your password.  Try again if you do not receive an email within 5 minutes."});
    }
    
    contents() {
        return (
            <form>
                <div style={{display: "flex", flexFlow: "column", justifyContent: "center", width: "300px"}}>
                    <Typography variant="caption">Send password reset request to:</Typography>
                    <TextField variant="standard" label="Email" size="small" inputMode="email" value={this.state.email} onChange={e => this.setState({email: e.target.value})} required={true}/>
                    <Button variant="text" type={"submit"} onClick={this.sendPasswordReset} disabled={!validator.validate(this.state.email)}>Submit</Button>
                    <Typography variant="caption" noWrap={false} color={"primary"} style={{textAlign: "center"}}>{this.state.message}</Typography>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {};
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        resetPassword: (email: string) => dispatch(forgotPassword(email))
    };
}

export const ForgotPassword = connect(mapStateToProps, mapDispatchToProps)(forgotPasswordForm);