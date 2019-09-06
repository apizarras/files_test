import React from "react";
import ReactDOM from "react-dom";
import Connect from "./components/Connect";
import { App } from "./App";

ReactDOM.render(
  <Connect App={App} />,
  document.getElementById("fx")
);

