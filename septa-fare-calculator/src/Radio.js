import React from "react";

// radio button set component
const Radio = ({ options, name, onChange }) => {

    const change = (e) => {
        onChange(e.target.value);
    };

    const optionElements = options.map((option, index) => {
        // if option is disabled, we'll want to set a disabled class
        const disabledClass = option.disabled ? "disabled" : "";
        return (
            <li
                className={`radio-set-option ${disabledClass}`}
                key={index}
            >
                <input
                    checked={option.checked}
                    disabled={option.disabled}
                    id={`${name}${index}`}
                    name={name}
                    onChange={change}
                    type="radio"
                    value={option.value}
                />
                <label htmlFor={`${name}${index}`}>{option.label}</label>
            </li>
        );
    });

    return (
        <ul className="radio-set">
            {optionElements}
        </ul>
    );
};

export default Radio;


