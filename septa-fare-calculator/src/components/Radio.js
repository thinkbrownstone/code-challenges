import React, { useContext, useEffect } from "react";
import { WidgetContext } from "../contexts/WidgetsContext";
import "./Radio.css";

const Radio = ({ label, options, contextName }) => {
  const [buttonSelected, setButtonSelected] = useContext(WidgetContext)[
    contextName
  ];
  useEffect(() => {
    setButtonSelected(options[0]);
  }, []);

  const renderRadioButtons = (options, name) => {
    const results = options.map((option, index) => {
      return (
        <div key={index}>
          <input
            type="radio"
            name={name}
            id={option.value}
            checked={
              buttonSelected
                ? option.value === buttonSelected.value
                  ? "checked"
                  : ""
                : index === 0
                ? "checked"
                : ""
            }
            onChange={() => setButtonSelected(option)}
          />
          <label className="radio-button-label" htmlFor={option.value}>
            {option.label}
          </label>
        </div>
      );
    });
    return <div className="radio-button-options">{results}</div>;
  };
  return (
    <div className="flex-column-center">
      <h3>{label}</h3>
      {renderRadioButtons(options)}
    </div>
  );
};
export default Radio;
