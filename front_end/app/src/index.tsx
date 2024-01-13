import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { GamePopupProvider } from "./context/GamePopupContext";
import { ErrorProvider } from "./context/ErrorContext";
import { ErrorSnackbar } from "./components/alert/ErrorSnackbar";

import { StyledEngineProvider } from "@mui/material/styles";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ErrorProvider>
        <ErrorSnackbar />
        <GamePopupProvider>
          <App />
        </GamePopupProvider>
      </ErrorProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
