import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { router } from './components/router.js';
import {
  RouterProvider,
} from 'react-router-dom'

import { Provider as ReduxProvider } from 'react-redux'
import store from './redux/store.js'

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
  const dev_domain = 'localhost' // 0.0.0.0
  window.urls.frontend = `http://${dev_domain}:3000/`
  window.urls.api = `http://${dev_domain}:17215/api/`
}

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider
        router={router}
        fallbackElement="Loading…"
      />
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
