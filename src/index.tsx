import React from "react";
import ReactDOM from "react-dom/client";
import { AppRoutes } from "./Routes";
import "./coreStyles/globalStyles.scss";
import { PopUps } from "./coreComponents/PopUps/PopUps";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <AppRoutes />
    <PopUps />
  </React.StrictMode>,
);
