import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import routes from "./router/Routes.jsx"
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import App from './App.jsx'
const queryClient = new QueryClient();
const router = createBrowserRouter(routes);
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
