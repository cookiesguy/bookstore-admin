import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'Style/main.css';
import App from './App';
import LoginProvider from 'Context/LoginContext';
import SideBarProvider from 'Context/SideBarContext';

ReactDOM.render(
   <BrowserRouter>
      <React.StrictMode>
         <LoginProvider>
            <SideBarProvider>
               <App />
            </SideBarProvider>
         </LoginProvider>
      </React.StrictMode>
   </BrowserRouter>,
   document.getElementById('root')
);
