import * as React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {orange, yellow} from '@material-ui/core/colors';
import {SiteTopMenu} from './features/AppBar/SiteTopMenu';
import './App.scss';
import {SideBar} from "./features/AppBar/SideMenu";
import {store} from "./app/store";
import {Provider} from "react-redux";

const theme = createMuiTheme({
    palette: {
       primary: {
           main: orange["800"]
       },
       secondary: yellow
    },
    typography: {
        button: {
            fontWeight: "bold"
        },
    }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <SiteTopMenu />
            <div style={{display: "flex"}}>
                <SideBar />
            </div>
        </Provider>
    </ThemeProvider>
  );
}

export default App;
