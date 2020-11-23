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
    GET_USER = "USER/GET",
    USER_CREATE_STARTED = "USER/USER_CREATE_STARTED",
    USER_CREATED = "USER/CREATE",
    USER_CREATE_FAILED = "USER/USER_CREATE_FAILED",
    VERIFY_USER = "USER/VERIFY"
}

const actions = {
    loginStarted: makeAction<UserActionTypes.LOGIN_STARTED, void>(UserActionTypes.LOGIN_STARTED),
    loggedIn: makeAction<UserActionTypes.LOGIN_SUCCESS, IUserState>(UserActionTypes.LOGIN_SUCCESS),
    loginFailed: makeAction<UserActionTypes.LOGIN_FAILED, string>(UserActionTypes.LOGIN_FAILED),
    logout: makeAction<UserActionTypes.LOGOUT, void>(UserActionTypes.LOGOUT),
    gotoLogin: makeAction<UserActionTypes.GOTO_LOGIN, void>(UserActionTypes.GOTO_LOGIN),
    getUser: makeAction<UserActionTypes.GET_USER, IUserState>(UserActionTypes.GET_USER),
    registrationStarted: makeAction<UserActionTypes.USER_CREATE_STARTED, void>(UserActionTypes.USER_CREATE_STARTED),
    userCreated: makeAction<UserActionTypes.USER_CREATED, string>(UserActionTypes.USER_CREATED),
    userCreationFailed: makeAction<UserActionTypes.USER_CREATE_FAILED, string>(UserActionTypes.USER_CREATE_FAILED),
    verified: makeAction<UserActionTypes.VERIFY_USER, void>(UserActionTypes.VERIFY_USER)
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
            Axios.post(`${host_url}/users/resetPassword`, {token: token, password: password}).then(() => { dispatch(push("/Login")) });
        } catch (error) {
            console.log(error);
        }
    }
}

export function login(username: string, password: string) : Dispatch<any> {
    return dispatch => {
        dispatch(actions.loginStarted());

        handle(Axios.post(`${host_url}/users/login`,{username: username, password: password}, {withCredentials: true})).then(action => dispatch(action));
    }
}

export function socialLogin(token: SocialToken) : Dispatch<any> {
    return dispatch => {
        dispatch(actions.loginStarted());
        
        handle(Axios.post(`${host_url}/users/socialLogin`, {token: token})).then(action => dispatch(action));
    }
}

export function getUser() : Dispatch<any> {
    return dispatch => {
        dispatch(actions.loginStarted());

        handle(Axios.get(`${host_url}/users/`, {withCredentials: true}))
            .then(action => {
                switch (action.type) {
                    case UserActionTypes.LOGIN_FAILED:
                        dispatch(actions.loginFailed(""));
                        break;
                    case UserActionTypes.LOGIN_SUCCESS:
                        dispatch(action);
                        break;
                }
            });
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

export function logout() : Dispatch<any> {
    return dispatch => {
        Axios.post(`${host_url}/users/logout`, {}, {withCredentials: true}).then(() => dispatch(actions.logout()));
    }
}

export function verifyUser(token: string): Dispatch<any> {
    return dispatch => {
        Axios.post(`${host_url}/users/verify`, {token: token}, {withCredentials: true}).then(() => dispatch(actions.verified()));
    }
}

export function createNew(user: IUserState, username: string, password: string): Dispatch<any> {
    return dispatch => {
        dispatch(actions.registrationStarted());
        
        Axios.post(`${host_url}/users/register`, {username: username, password: password, email: user.email, display: user.displayName}, {withCredentials: true})
            .then(response => {
                const result: any = response.data;
                console.log(result);
                dispatch(!result.error ? actions.userCreated(result.token) : actions.userCreationFailed(result.error));
            })
            .catch(error => {
                dispatch(actions.userCreationFailed(error.response.data.error))
            });
    }
}

export type UserActions = IActionUnion<typeof actions>
