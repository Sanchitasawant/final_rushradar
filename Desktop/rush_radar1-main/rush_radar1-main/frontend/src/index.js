import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";

// Send cookies (session, etc.) for all Axios requests
axios.defaults.withCredentials = true;

// Configure CSRF tokens for Django
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
