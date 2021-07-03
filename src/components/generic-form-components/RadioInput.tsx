import React, { ChangeEventHandler } from 'react';

type RadioInputProps = {
  checked: boolean,
  onChange: ChangeEventHandler<HTMLInputElement>,
  value: string,
  label: string,
}

const RadioInput = ({ checked, onChange, value, label } : RadioInputProps) => (
  <div>
    <input
      name={label}
      type="radio"
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <label htmlFor="{label}">{label}</label>
  </div>
);

export default RadioInput;