import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '../util';
// Utilized CSS module to prevent any CSS name collisions in the rest of the app
import styles from '../index.module.css';

function RideTime({ rideTime, rideTimes, setRideTime, displayText }) {
  const {
    formSection,
    label,
    selectField,
    selectWrapper,
    inputField,
    helperText,
  } = styles;
  return (
    <div className={formSection}>
      <label htmlFor="ride-time">
        <h4 className={label}>When are you riding?</h4>
      </label>
      <div className={selectWrapper}>
        <select
          className={selectField + ' ' + inputField}
          value={rideTime}
          onChange={(e) => setRideTime(e.target.value)}
          name="ride-time"
        >
          <option value="">Select a Ride Time</option>
          {rideTimes && rideTimes.length ? (
            rideTimes.map((rideTime, i) => (
              <option key={`ride-time-${i + 1}`} value={rideTime}>
                {capitalize(rideTime)}
              </option>
            ))
          ) : (
            <></>
          )}
        </select>
      </div>
      <p className={helperText}>{displayText}</p>
    </div>
  );
}

RideTime.propTypes = {
  rideTime: PropTypes.string,
  rideTimes: PropTypes.arrayOf(PropTypes.string),
  setRideTime: PropTypes.func,
  displayText: PropTypes.string,
};

export default RideTime;
