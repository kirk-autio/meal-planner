import {IUserState, loggedOutUser} from "../state/userState";
import Axios from "axios";
import {Dispatch} from "react";
import {IActionUnion, makeAction} from "./action";

export enum UserActionTypes {
    LOGIN_STARTED = "USER/LOGIN_STARTED",
    LOGIN_SUCCESS = "USER/LOGIN_SUCCESS",
    LOGIN_FAILED = "USER/LOGIN_FAILED"
}

const actions = {
    loginStarted: makeAction<UserActionTypes.LOGIN_STARTED, void>(UserActionTypes.LOGIN_STARTED),
    loggedIn: makeAction<UserActionTypes.LOGIN_SUCCESS, IUserState>(UserActionTypes.LOGIN_SUCCESS),
    loginFailed: makeAction<UserActionTypes.LOGIN_FAILED, string>(UserActionTypes.LOGIN_FAILED)
}

export function login(username: string, password: string) : Dispatch<any> {
    return dispatch => {
        dispatch(actions.loginStarted());

        Axios.get("http://localhost:5001/test", {
            params: {
                username: username
                , password: password
            }
        })
        .then(response => {
            dispatch(actions.loggedIn(loggedOutUser));
        })
        .catch(error => {
            dispatch(actions.loginFailed(error));  
        })
    }
}

export type UserActions = IActionUnion<typeof actions>
// export type UserActions = LoginStartedAction | LoggedInAction | LoginFailedAction;