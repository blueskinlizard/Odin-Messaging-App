import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import routes from "./router/Routes.jsx"
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter(routes);
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
