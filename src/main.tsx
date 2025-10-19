import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.tsx'
import Login from './pages/auth/login.tsx'
import Register from './pages/auth/register.tsx';
import Noticia from './pages/Noticia.tsx';
import OauthCallback from './pages/auth/oauth.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/noticia/:title",
    element: <Noticia />,
  },
  {
    path: "/oauth/callback",
    element: <OauthCallback />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);