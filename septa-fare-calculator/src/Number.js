import React from "react";

// number input component

const Number = ({ options, onChange }) => {

    const change = (e) => {
        onChange(e.target.value);
    };

    return (
        <input
            onChange={change}
            type="number"
            {...options}
        />
    );
};

export default Number;


