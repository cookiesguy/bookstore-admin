import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'style/main.css';
import App from './App';
import LoginProvider from 'context/LoginContext';

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <LoginProvider>
        <App />
      </LoginProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
