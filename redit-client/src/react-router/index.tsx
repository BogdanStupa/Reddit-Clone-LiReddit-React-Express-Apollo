import React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import Home  from '../entries/Home';
import Register from '../entries/Register';
import Login from '../entries/Login';
import AppContainer from '../containers/AppContainer';

type AppRouterProps = RouteComponentProps<{}, {}>

const AppRouter: React.FC<AppRouterProps> = (props: AppRouterProps) => { 
    return (
    <AppContainer>
        <Switch location={props.location}>
            <Route exact path="/">
                <Home/>
            </Route>
            <Route exact path='/signup' >
                <Register />
            </Route>
            <Route exact path='/login' >
                <Login />
            </Route>
        </Switch>
    </AppContainer>
    );
}

export default withRouter(AppRouter);