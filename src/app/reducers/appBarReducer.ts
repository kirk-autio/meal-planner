import {IAppBarState, initialState} from "../state/appBarState";
import {AppBarActionTypes, AppBarEvents} from "../actions/appBarActions";

const appBarReducer = (state: IAppBarState = initialState, action: AppBarActionTypes): IAppBarState => {
    switch (action.type) {
        case AppBarEvents.TOGGLE_MENU:
            return { ...state, isOpen: !state.isOpen};
        default: 
            return state;
    }
}

export {appBarReducer}