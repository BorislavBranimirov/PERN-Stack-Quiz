import React from 'react';
import ReactDOM from 'react-dom';
import { config } from '@fortawesome/fontawesome-svg-core';
import App from './App';
import './style.scss';

// don't auto insert the css in the <head> for CSP
// https://fontawesome.com/how-to-use/on-the-web/other-topics/security
config.autoAddCss = false;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
