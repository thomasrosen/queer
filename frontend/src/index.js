import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { router } from './components/router.js';
import {
  RouterProvider,
} from 'react-router-dom'

// import reportWebVitals from './reportWebVitals';

// check if domain is 0.0.0.0
const isLocalhost = Boolean(
  window.location.hostname === '0.0.0.0' ||
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]'
)

window.env = isLocalhost === true ? 'dev' : 'prod'
window.urls = {
  frontend: 'https://queer.thomasrosen.me/',
  api: 'https://queer.thomasrosen.me/api/',
}
if (window.env === 'dev') {
  window.urls.frontend = 'http://0.0.0.0:3000/'
  window.urls.api = 'http://0.0.0.0:17215/api/'
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
// to log results (for example: reportWebVitals(console.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
