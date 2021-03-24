import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import { WidgetProvider } from "./contexts/WidgetsContext";

ReactDOM.render(
  <WidgetProvider>
    <App />
  </WidgetProvider>,
  document.querySelector("#root")
);
