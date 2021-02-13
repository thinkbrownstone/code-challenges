import React from "react";

// select menu  component
const Select = ({ options, onChange }) => {

    const change = (e) => {
        onChange(e.target.value);
    };

    const optionElements = options.map((option, index) => {
        return (
            <option value={option.value} key={index}>
                {option.label}
            </option>
        );
    });

    return (
        <select onChange={change}>
            {optionElements}
        </select>
    );
};

export default Select;

