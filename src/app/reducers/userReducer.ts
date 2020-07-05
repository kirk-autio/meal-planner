import {UserActions, UserActionTypes} from "../actions/userActions";
import {IUserState, loggedOutUser} from "../state/userState";

const userReducer = (state: IUserState = loggedOutUser, action: UserActions): IUserState => {
    switch (action.type) {
        case UserActionTypes.LOGIN_STARTED:
            return {...state, loading: true};
        case UserActionTypes.LOGIN_SUCCESS:
            return action.payload;
        case UserActionTypes.LOGIN_FAILED:
            return {...state, loading: false, error: action.payload}
        case UserActionTypes.LOGOUT:
            return loggedOutUser;
        default: 
            return state;
    }
}

export {userReducer}