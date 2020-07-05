import './globalStyles.scss'
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import * as React from "react";
import {IUserState} from "../../app/state/userState";
import {Button, Typography} from "@material-ui/core";
import {Dispatch} from "react";
import {toggleAppBar} from "../../app/actions/appBarActions";
import {logout} from "../../app/actions/userActions";
import {AppState} from "../../app/store";
import {connect} from "react-redux";

interface IProps {
    user: IUserState;
    title: string;
    toggle(): void;
    logout(): void;
}

interface IState { 
    username: string;
    password: string;
}

class SiteMenu extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        
        this.state = { username: "", password: ""};
    }
    Login = () => {
        if (this.props.user.token === "") {
            return (
                <Button color="inherit" href="/Login">Login</Button>
            )
        } else {
            return (
                <form>
                    <Typography variant="h6">{this.props.user.displayName}</Typography>
                    <Button color="inherit" onClick={() => this.props.logout()}>Logout</Button>
                </form>
            )
        }
    }
    
    render() {
        return (
            <AppBar position="fixed" style={{zIndex: 1201}}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer"><MenuIcon onClickCapture={this.props.toggle} /></IconButton>
                    <Typography variant="h6" style={{flexGrow:1}}>{this.props.title}</Typography>
                    <this.Login />
                </Toolbar>
            </AppBar>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        toggle: () => dispatch(toggleAppBar())
        , logout: () => dispatch(logout())
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        title: state.appBar.title
        , user: state.user
    }
}

export const SiteTopMenu = connect(mapStateToProps, mapDispatchToProps)(SiteMenu);
