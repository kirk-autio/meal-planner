import {IUserState, UserState} from "../state/userState";
import {Dispatch} from "react";
import {IActionUnion, makeAction} from "./action";
import Axios, {AxiosResponse} from "axios";
import {push} from "react-router-redux";

const host_url: string = "https://us-central1-mealplanner-cf93f.cloudfunctions.net/api/v1"

export enum UserActionTypes {
    LOGIN_STARTED = "USER/LOGIN_STARTED",
    LOGIN_SUCCESS = "USER/LOGIN_SUCCESS",
    LOGIN_FAILED = "USER/LOGIN_FAILED",
    LOGOUT = "USER/LOGOUT",
    GOTO_LOGIN = "USER/GOTO_LOGIN",
    GET_USER = "USER/GET"
}

const actions = {
    loginStarted: makeAction<UserActionTypes.LOGIN_STARTED, void>(UserActionTypes.LOGIN_STARTED),
    loggedIn: makeAction<UserActionTypes.LOGIN_SUCCESS, IUserState>(UserActionTypes.LOGIN_SUCCESS),
    loginFailed: makeAction<UserActionTypes.LOGIN_FAILED, string>(UserActionTypes.LOGIN_FAILED),
    logout: makeAction<UserActionTypes.LOGOUT, void>(UserActionTypes.LOGOUT),
    gotoLogin: makeAction<UserActionTypes.GOTO_LOGIN, void>(UserActionTypes.GOTO_LOGIN),
    getUser: makeAction<UserActionTypes.GET_USER, IUserState>(UserActionTypes.GET_USER)
}

export enum TokenType {
    Standard,
    Google,
    Facebook
}

export interface SocialToken {
    display: string;
    email: string;
    profileImage: string;
    accessToken: string;
    tokenType: TokenType
} 

export function forgotPassword(email: string) : Dispatch<any> {
    return () => {
        Axios.post(`${host_url}/users/forgotPassword`, {email: email}).then();
    }
}

export function resetPassword(token: string, password: string) : Dispatch<any> {
    return dispatch => {
        try {
            Axios.post(`${host_url}/users/resetPassword`, {token: token, password: password}).then(() => { alert ("sent"); dispatch(push("/Login")) });
        } catch (error) {
            console.log(error);
        }
    }
}

export function getUser() : Dispatch<any> {
    return dispatch => {
        Axios.get(`${host_url}/users/`).then(res => dispatch(actions.getUser(new UserState(res.data.token, res.data.display, res.data.email))));
    }
}

export function login(username: string, password: string) : Dispatch<any> {
    return dispatch => {
        dispatch(actions.loginStarted());

        handle(Axios.post(`${host_url}/users/login`,{username: username, password: password})).then(action => dispatch(action));
    }
}

export function socialLogin(token: SocialToken) : Dispatch<any> {
    return dispatch => {
        dispatch(actions.loginStarted());
        
        handle(Axios.post(`${host_url}/users/socialLogin`, {token: token})).then(action => dispatch(action));
    }
}

async function handle(loginResponse: Promise<AxiosResponse>): Promise<{ type: UserActionTypes, payload: IUserState | string }> {
    try {
        const user: any = (await loginResponse).data;
        return actions.loggedIn(new UserState(user.token, user.displayName, user.email));    
    } catch (error) {
        return actions.loginFailed(error.response.data.error) 
    }
}

export function logout() {
    return actions.logout();
}

export type UserActions = IActionUnion<typeof actions>
