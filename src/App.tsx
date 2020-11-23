import * as React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {orange, yellow, red, amber} from '@material-ui/core/colors';
import {SiteTopMenu} from './features/menu/SiteTopMenu';
import {SideBar} from "./features/menu/SideMenu";
import {store} from "./app/store";
import {Provider} from "react-redux";
import Routes from "./app/routes";
import './styles/App.scss';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: orange["800"]
        },
        secondary: yellow,
        error: red,
        warning: amber
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
            <Routes>
                <SiteTopMenu />
                <div style={{display: "flex"}}>
                    <SideBar />
                </div>
            </Routes>
        </Provider>
    </ThemeProvider>
  );
}

export default App;
