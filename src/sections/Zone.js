import React from 'react';
import PropTypes from 'prop-types';
// Utilized CSS module to prevent any CSS name collisions in the rest of the app
import styles from '../index.module.css';

function Zone({ zones, zone, setZone }) {
  const {
    firstFormSection,
    formSection,
    label,
    selectField,
    selectWrapper,
    inputField,
  } = styles;
  return (
    <div className={formSection + ' ' + firstFormSection}>
      <label htmlFor="zone">
        <h4 className={label}>Where are you going?</h4>
      </label>
      <div className={selectWrapper}>
        <select
          className={selectField + ' ' + inputField}
          value={zone}
          onChange={(e) => setZone(Number(e.target.value))}
          name="zone"
        >
          <option value="">Select a Zone</option>
          {zones && zones.length ? (
            zones.map((zone) => (
              <option
                key={`zone-${zone.zone}`}
                value={zone.zone}
              >{`Zone ${zone.zone}`}</option>
            ))
          ) : (
            <></>
          )}
        </select>
      </div>
    </div>
  );
}

Zone.propTypes = {
  zones: PropTypes.arrayOf(PropTypes.object),
  zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setZone: PropTypes.func,
};

export default Zone;
