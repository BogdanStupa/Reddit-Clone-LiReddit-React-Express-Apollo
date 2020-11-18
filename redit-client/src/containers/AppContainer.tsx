import React, { ReactNode } from 'react';
import NavBar from "../components/NavBar";

interface AppContainerProps {
    children: ReactNode
};


const AppContainer: React.FC<AppContainerProps> = (props: AppContainerProps) => {

    return (
        <div className="app-liredit">
            <NavBar/>
           {
               props.children
           }
        </div>
            
    );
}

export default AppContainer;