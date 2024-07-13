import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";
import "./app.css";
import { MyProvider } from "./Context/myContext";
import { Contract } from "./utils/icp";

window.renderICPromise = Contract().then(()=>{
    ReactDom.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <MyProvider>
            <App/>
            </MyProvider>
        </React.StrictMode>
    );
}).catch(console.error);
