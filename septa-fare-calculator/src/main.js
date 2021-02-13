import React from "react";
import ReactDOM from "react-dom";
import FareModule from "./FareModule";

document.addEventListener("DOMContentLoaded", function () {
    ReactDOM.render(
        React.createElement(FareModule),
        document.getElementById("mount")
  );
});
