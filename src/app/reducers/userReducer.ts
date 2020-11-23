import {UserActions, UserActionTypes} from "../actions/userActions";
import {IUserState, loggedOutUser, MessageType, UserMessage} from "../state/userState";

const userReducer = (state: IUserState = loggedOutUser, action: UserActions): IUserState => {
    switch (action.type) {
        case UserActionTypes.LOGIN_STARTED:
            return {...state, loading: true};
        case UserActionTypes.LOGIN_SUCCESS:
            return action.payload;
        case UserActionTypes.LOGIN_FAILED:
            return {...state, loading: false, message: new UserMessage(action.payload, MessageType.Login)};
        case UserActionTypes.LOGOUT:
            return loggedOutUser;
        case UserActionTypes.USER_CREATE_STARTED:
            return {...state, loading: true};
        case UserActionTypes.USER_CREATED:
            return {...state, loading: false, token: action.payload, message: new UserMessage("Your new account needs to be verified. You should receive a verification email shortly.", MessageType.Registration)};
        case UserActionTypes.USER_CREATE_FAILED:
            return {...state, loading: false, message: new UserMessage(action.payload, MessageType.Registration)};
        case UserActionTypes.VERIFY_USER:
            return {...state, verified: true};
        default: 
            return state;
    }
}

export {userReducer}