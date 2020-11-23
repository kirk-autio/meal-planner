import CommonComponent, {ICommonProps, ICommonState} from "../BaseComponent";
import React, {Dispatch} from "react";
import {AppState} from "../../app/store";
import {connect} from "react-redux";
import {getUser} from "../../app/actions/userActions";
import {Button} from "@material-ui/core";

interface IState extends ICommonState {
}

interface IProps extends ICommonProps {
    getUserDetails(): void;
    display: string;
}

class profile extends CommonComponent<IProps, IState> {

    contents(): JSX.Element {
        return (
            <div>
                {this.props.display}
                <Button onClick={() => this.props.getUserDetails()}>Update</Button>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        display: state.user.displayName
    };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        getUserDetails: () => dispatch(getUser())
    };
}

export const Profile = connect(mapStateToProps, mapDispatchToProps)(profile);