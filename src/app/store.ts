import { createStore, combineReducers, applyMiddleware } from 'redux';
import {appBarReducer} from "./reducers/appBarReducer";
import {userReducer} from "./reducers/userReducer";
import thunk from 'redux-thunk';

const rootReducer = combineReducers({ 
    appBar: appBarReducer
    , user: userReducer
})

export type AppState = ReturnType<typeof rootReducer>;
export const store = createStore(rootReducer, applyMiddleware(thunk));