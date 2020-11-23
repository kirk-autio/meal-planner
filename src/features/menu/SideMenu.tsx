import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../app/store";
import {Drawer, List, ListItem, ListItemIcon, Toolbar} from "@material-ui/core";

interface IProps {
    isOpen: boolean
}

class SideMenu extends React.Component<IProps> {
    render() {
        return (
            <Drawer variant="persistent" anchor="left" open={this.props.isOpen}>
                <Toolbar />
                <List>
                    <ListItem>
                        <ListItemIcon>asdf</ListItemIcon>
                    </ListItem>
                </List>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        isOpen: state.appBar.isOpen
    }
} 

export const SideBar = connect(mapStateToProps)(SideMenu);

