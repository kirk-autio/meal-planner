import CommonComponent, {ICommonProps, ICommonState} from "../BaseComponent";
import {Typography} from "@material-ui/core";
import React, {Dispatch} from "react";
import {AppState} from "../../app/store";
import {connect} from "react-redux";
import {verifyUser} from "../../app/actions/userActions";

interface IState extends ICommonState {
    verified: boolean;
}

interface IProps extends ICommonProps {
    match: any;
    verify(token: string): void;
    verified: boolean;
}

class verifyLogin extends CommonComponent<IProps, IState> {
    componentDidMount() {
        if (!this.props.verified) this.props.verify(this.props.match.params.id);
    }

    contents(): JSX.Element {
        return this.props.verified 
            ? (<Typography variant="caption">Thank you! Your account has been verified and you may now login</Typography>)
            : (<Typography variant="caption">Please wait while your account is verified</Typography>);
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        verified: state.user.verified
    };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        verify: (token: string) => dispatch(verifyUser(token))
    };
}

export const VerifyLogin = connect(mapStateToProps, mapDispatchToProps)(verifyLogin);