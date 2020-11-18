import React, { MouseEvent } from "react";
import { NavLink } from 'react-router-dom';
import constants from '../constants';
import Navbar from "react-bootstrap/Navbar";
import { useApolloClient, useQuery } from "@apollo/client";
import { Button } from "react-bootstrap";
import { GET_IS_AUTH, GET_USER_DATA } from "../client-graphql";
import { IAuthDataResponse, IUserDataResponse } from "../types";
import { useLogoutMutation } from "../generated/graphql";
import { withRouter } from "react-router-dom";
import { History } from "history";


interface NavBarProps {
    history: History
};


const NavBar: React.FC<NavBarProps> = ({ history }) => {
    const { data: authData } = useQuery<IAuthDataResponse>(GET_IS_AUTH);
    const { data: userData } = useQuery<IUserDataResponse>(GET_USER_DATA);
    const [logout, ] = useLogoutMutation();

    const client = useApolloClient();

    const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        if(!authData) return false;
        logout({
            variables: {
                options: {
                    refreshToken: authData.isAuth.refreshToken,
                    userId: authData.isAuth.id
                }
            }
        });
        client.resetStore();
        history.push("/login");
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand>{constants.LABELS.LIREDIT}</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            {
                authData && authData.isAuth ?
                (   
                    authData.isAuth.auth ? (
                        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">                    
                            <NavLink to="/">
                                <Button size="sm" variant="link">{ userData && userData.userData.username }</Button>
                            </NavLink>
                
                            <Navbar.Text style={{marginLeft: 10}}>
                                  <Button size="sm" onClick={handleClick} variant="link">Logout</Button>
                            </Navbar.Text>
                        </Navbar.Collapse>
                    ) : (
                        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">                    
                            <NavLink to="/signup">
                                <Button size="sm" variant="link">{constants.LABELS.ROUTE_NAMES.SIGNUP}</Button>
                            </NavLink>
                
                            <NavLink style={{marginLeft: 10}} to="/login">
                                <Button size="sm" variant="link">{constants.LABELS.ROUTE_NAMES.LOGIN}</Button> 
                            </NavLink>
                        </Navbar.Collapse>
                    )
                ) : null
            }   
         </Navbar>
    );
}

export default withRouter(NavBar);