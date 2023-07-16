import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import QAPI from "qapi";

window.QAPI = QAPI;
ReactDOM.render(<App />, document.getElementById("root"));
