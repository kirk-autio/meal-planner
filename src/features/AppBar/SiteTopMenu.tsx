import './globalStyles.scss'
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import * as React from "react";
import {AppState} from "../../app/store";
import {connect} from "react-redux";
import {Dispatch} from "react";
import {toggleAppBar} from "../../app/actions/appBarActions";
import {IUserState} from "../../app/state/userState";
import {login} from "../../app/actions/userActions";
import {
    Button,
    TextField,
    Typography,
} from "@material-ui/core";

interface IProps {
    user: IUserState;
    title: string;
    toggle(): void;
    login(username: string, password: string): void;
}

class SiteMenu extends React.Component<IProps> {
    Login = () => {
        return (
            <form>
                <TextField className="menuInput" size="small" variant="filled" label="Username" />
                <TextField className="menuInput" size="small" variant="filled" label="Password" />
                <Button color="inherit" onClick={() => this.props.login("", "")}>Login</Button>
            </form>    
        )
    }
    
    render() {
        return (
            <AppBar position="fixed" style={{zIndex: 1201}}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer"><MenuIcon onClick={this.props.toggle} /></IconButton>
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
        , login: (username: string, password: string) => dispatch(login(username, password))
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        title: state.appBar.title
        , user: state.user
    }
}

export const SiteTopMenu = connect(mapStateToProps, mapDispatchToProps)(SiteMenu);
