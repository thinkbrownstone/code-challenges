import React, { ChangeEventHandler } from 'react';
import { replaceUnderscores } from '../../utils';
import './SelectDropdown.css';

type SelectDropdownProps = {
  value: string,
  label: string,
  placeholderText: string,
  options: Array<string>,
  onChange: ChangeEventHandler<HTMLSelectElement>,
}

const SelectDropdown = ({ value, label, placeholderText, options, onChange } : SelectDropdownProps) => (
  <>
    <label>{label}</label>
    <div className="select-dropdown-container">
      <select
        className="select-dropdown"
        name={value}
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholderText}</option>
        {options.map((option) => (
          <option key={option} value={option}>{replaceUnderscores(option)}</option>
        ))}
      </select>
    </div>
  </>
);

export default SelectDropdown;