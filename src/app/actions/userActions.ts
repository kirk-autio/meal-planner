import {IUserState, UserState} from "../state/userState";
import Axios from "axios";
import {Dispatch} from "react";
import {IActionUnion, makeAction} from "./action";
import * as qs from 'querystring';

const host_url: string = "https://us-central1-mealplanner-cf93f.cloudfunctions.net/userApi/v1"

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

        Axios.post(`${host_url}/login`, qs.stringify({username: username, password: password}), {headers: {'Content-Type': 'x-www-form-urlencoded', 'Access-Control-Allow-Origin': 'https://localhost:5002'}})
        .then(response => {
            const user = JSON.parse(response.data)
            dispatch(actions.loggedIn(new UserState(user.token, user.display, user.email)));
        })
        .catch(error => {
            dispatch(actions.loginFailed(error));  
        })
    }
}

export type UserActions = IActionUnion<typeof actions>
// export type UserActions = LoginStartedAction | LoggedInAction | LoginFailedAction;