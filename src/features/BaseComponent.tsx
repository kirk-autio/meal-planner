import React from "react";
import {Toolbar} from "@material-ui/core";

export interface ICommonProps {
    history: any;
}

export interface ICommonState {
    
}

export default class CommonComponent<P extends ICommonProps, S extends ICommonState> extends React.Component<P,S> {
    render() : JSX.Element {
        return (
            <div>
                <Toolbar />
                <div className={"content"} >
                    {this.contents()}
                </div>
            </div>
        );
    }
    
    contents() : JSX.Element {
        return (<div/>);
    }
}