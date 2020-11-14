import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createClient, Provider } from 'urql';
import './styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import AppRouter from './react-router';
import constants from  "./constants";

const client = createClient({ 
    url: constants.GRAPHQL.PATH,
    fetchOptions: {
        credentials: "include"
    }
});

ReactDOM.render(
    <React.StrictMode>
        <Provider value={client}>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
