import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import constants from '../constants';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

interface AppContainerProps {
    children: ReactNode
};


const AppContainer: React.FC<AppContainerProps> = (props: AppContainerProps) => {

    return (
        <div className="app-liredit">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand>React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link>Features</Nav.Link>
                    <Nav.Link>Pricing</Nav.Link>
                </Nav>

                <NavLink to="/signup">
                    {constants.LABELS.NAVBAR.SIGNUP}
                </NavLink>
            
                <NavLink style={{marginLeft:10}} to="login">
                    {constants.LABELS.NAVBAR.LOGIN}
                </NavLink>

            </Navbar.Collapse>
            </Navbar>
           {
               props.children
           }
        </div>
            
    );
}

export default AppContainer;