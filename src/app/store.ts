import { createStore, combineReducers, applyMiddleware } from 'redux';
import {appBarReducer} from "./reducers/appBarReducer";
import {userReducer} from "./reducers/userReducer";
import thunk from 'redux-thunk';
import {routerMiddleware} from "react-router-redux";
import {createBrowserHistory} from "history";

const rootReducer = combineReducers({ 
    appBar: appBarReducer
    , user: userReducer
});

export const history = createBrowserHistory();
const middleware = routerMiddleware(history);

export type AppState = ReturnType<typeof rootReducer>;
export const store = createStore(rootReducer, applyMiddleware(thunk, middleware));