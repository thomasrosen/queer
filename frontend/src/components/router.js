import {
  createHashRouter,
} from 'react-router-dom'

import App from './App.js'
import Welcome from './pages/welcome.js'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Welcome />,
      },
      {
        path: '*',
        element: <Welcome />,
      },
    ]
  },
]);
