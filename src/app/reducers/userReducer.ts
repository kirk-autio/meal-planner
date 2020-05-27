import {UserActions, UserActionTypes} from "../actions/userActions";
import {IUserState, loggedOutUser} from "../state/userState";

const userReducer = (state: IUserState = loggedOutUser, action: UserActions): IUserState => {
    switch (action.type) {
        case UserActionTypes.LOGIN_STARTED:
            return {...state, loading: true};
        case UserActionTypes.LOGIN_SUCCESS:
            alert(JSON.stringify(action.payload));
            return action.payload
        case UserActionTypes.LOGIN_FAILED:
            alert(action.payload);
            return {...state, loading: false, error: action.payload}
        default: 
            return state;
    }
}

export {userReducer}