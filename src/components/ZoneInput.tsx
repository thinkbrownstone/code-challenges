import React from 'react';
import SelectDropdown from './generic-form-components/SelectDropdown';

type ZoneInputProps = {
  zone: string,
  setZoneValue: (val: string) => void,
  options: Array<any>,
}

const ZoneInput = ({ zone, setZoneValue, options } : ZoneInputProps) => {
  return (
    <div className="section with-bottom-border">
      <SelectDropdown
        value={zone}
        label="Where are you going?"
        placeholderText="Select Zone"
        options={options.map(zone => zone.name)}
        onChange={(e) => setZoneValue(e.target.value)}
      />
    </div>
  );
}

export default ZoneInput; 