import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.tsx'
import Login from './pages/auth/login.tsx'
import Register from './pages/auth/register.tsx';
import Noticia from './pages/Noticia.tsx';
import OauthCallback from './pages/auth/oauth.tsx';
import VerifyEmail from './pages/auth/verify-email.tsx';
import ResendVerification from './pages/auth/resend-verification.tsx';
import ForgotPassword from './pages/auth/forgot-password.tsx';
import ResetPassword from './pages/auth/reset-password.tsx';

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
    path: "/noticia/:category/:title",
    element: <Noticia />,
  },
  {
    path: "/oauth/callback",
    element: <OauthCallback />,
  },
  {
    path: "/email/verify",
    element: <VerifyEmail />,
  },
  {
    path: "/email/resend",
    element: <ResendVerification />,
  },
  {
    path: "/password/forgot",
    element: <ForgotPassword />,
  },
  {
    path: "/password/reset",
    element: <ResetPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);