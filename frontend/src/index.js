import App from "./components/app";
import React from "react";
import ReactDOM from "react-dom/client";
const rootelm = document.getElementById("app");
const root = ReactDOM.createRoot(rootelm)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

