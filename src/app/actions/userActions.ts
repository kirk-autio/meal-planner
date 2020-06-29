import {IUserState, UserState} from "../state/userState";
import Axios from "axios";
import {Dispatch} from "react";
import {IActionUnion, makeAction} from "./action";

const host_url: string = "https://us-central1-mealplanner-cf93f.cloudfunctions.net/api/v1"

export enum UserActionTypes {
    LOGIN_STARTED = "USER/LOGIN_STARTED",
    LOGIN_SUCCESS = "USER/LOGIN_SUCCESS",
    LOGIN_FAILED = "USER/LOGIN_FAILED",
    LOGOUT = "USER/LOGOUT"
}

const actions = {
    loginStarted: makeAction<UserActionTypes.LOGIN_STARTED, void>(UserActionTypes.LOGIN_STARTED),
    loggedIn: makeAction<UserActionTypes.LOGIN_SUCCESS, IUserState>(UserActionTypes.LOGIN_SUCCESS),
    loginFailed: makeAction<UserActionTypes.LOGIN_FAILED, string>(UserActionTypes.LOGIN_FAILED),
    logout: makeAction<UserActionTypes.LOGOUT, void>(UserActionTypes.LOGOUT)
}

export function login(username: string, password: string) : Dispatch<any> {
    return dispatch => {
        dispatch(actions.loginStarted());

        Axios.post(`${host_url}/users/login`,  {username: username, password: password})
        .then(response => {
            const user = response.data;
            dispatch(actions.loggedIn(new UserState(user.token, user.displayName, user.email)));
        })
        .catch(error => {
            dispatch(actions.loginFailed(error.response.data.error));  
        })
    }
}

export function logout() {
    return actions.logout();
    
}

export type UserActions = IActionUnion<typeof actions>
