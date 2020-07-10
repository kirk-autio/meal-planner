import CommonComponent, {ICommonProps, ICommonState} from "../BaseComponent";
import React, {Dispatch} from "react";
import {AppState} from "../../app/store";
import {connect} from "react-redux";
import {Button, FormControl, IconButton, Input, InputLabel} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {resetPassword} from "../../app/actions/userActions";

interface IProps extends ICommonProps {
    match: any;
    resetPassword(token: string, password: string): void;
}

interface IState extends ICommonState {
    token: string;
    password: string;
    showPassword: boolean;
}

class passwordReset extends CommonComponent<IProps, IState> {
    
    constructor(props: IProps) {
        super(props);
        
        this.state = {token: props.match.params.id, password: "", showPassword: false};
        this.reset = this.reset.bind(this);
    }

    reset(event: React.MouseEvent) {
        event.preventDefault();
        this.props.resetPassword(this.state.token, this.state.password);
    }
    
    visibleButton() {
        return (
            (<IconButton onClick={() => this.setState({showPassword: !this.state.showPassword})}>{!this.state.showPassword ? <Visibility/> : <VisibilityOff />}</IconButton>)
        );
    }
    
    contents() {
        return (
            <div style={{display: "flex", flexFlow: "column"}}>
                <FormControl>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" type={this.state.showPassword ? "text" : "password"} value={this.state.password} onChange={e => this.setState({password: e.target.value})} endAdornment={this.visibleButton()} />
                </FormControl>
                <Button type="submit" onClick={this.reset}>Reset Password</Button>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {};
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        resetPassword: (token: string, password: string) => dispatch(resetPassword(token, password))
    };
}

export const PasswordReset = connect(mapStateToProps, mapDispatchToProps)(passwordReset);