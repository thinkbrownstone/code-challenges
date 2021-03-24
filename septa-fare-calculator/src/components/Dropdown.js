import React, { useContext, useState, useEffect, useRef } from "react";
import { WidgetContext } from "../contexts/WidgetsContext";

import "./Dropdown.css";
const Dropdown = ({ label, options, contextName }) => {
  const [selected, setSelected] = useContext(WidgetContext)[contextName];

  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setSelected(options[0]);

    const onBodyClick = (event) => {
      if (ref.current && ref.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    document.body.addEventListener("click", onBodyClick);

    return () => {
      document.body.removeEventListener("click", onBodyClick);
    };
  }, [options]);
  const renderedOptions = () => {
    return options.map((option) => {
      if (option.value === selected.value) return null;

      return (
        <div
          key={option.value}
          className="dropdown-item"
          onClick={() => setSelected(option)}
        >
          {option.label}
        </div>
      );
    });
  };
  return (
    <div ref={ref} className="uid formd">
      <div className="fieldd">
        <h3 className="label">{label}</h3>
        <div
          onClick={() => setOpen(!open)}
          className={`dropdown-selection ${open ? "visible active" : ""}`}
        >
          <div className="dropdown-text">{selected.label}</div>
          <i className="dropdown icon"></i>
          <i className="dropdown-icon"></i>

          <div className={`dropdown-menu ${open ? "visible transition" : ""}`}>
            {renderedOptions()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dropdown;
