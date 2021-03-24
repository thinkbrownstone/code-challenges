import React, { useContext } from "react";

import { WidgetContext, QUANTITY } from "../contexts/WidgetsContext";
import "./Text.css";

const Text = ({ label }) => {
  const [textEntered, setTextEntered] = useContext(WidgetContext)[QUANTITY];
  const isValidEntry = (value) => {
    if (isNaN(value)) return false;
    const result = value.match(/[^0-9]/g);

    return result === null && +value <= 100 ? true : false;
  };
  return (
    <div>
      <div className="ui formd">
        <div className="fieldd">
          <h3>{label}</h3>
          <input
            type="number"
            min="1"
            max="100"
            placeholder="Enter a number between 1 and 100"
            value={textEntered}
            onChange={(e) =>
              isValidEntry(e.target.value)
                ? setTextEntered(e.target.value)
                : setTextEntered("")
            }
          />
        </div>
      </div>
    </div>
  );
};
export default Text;
