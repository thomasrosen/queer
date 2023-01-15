import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { router } from './components/router.js';
import {
  RouterProvider,
} from 'react-router-dom'

// import reportWebVitals from './reportWebVitals';

window.env = 'dev' // dev / prod
window.urls = {
  frontend: 'https://queer.thomasrosen.me/',
  api: 'https://queer.thomasrosen.me/api/',
}
if (window.env === 'dev') {
  window.urls.frontend = 'http://localhost:3000/'
  window.urls.api = 'http://localhost:1337/api/'
}

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      fallbackElement="Loading…"
    />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
