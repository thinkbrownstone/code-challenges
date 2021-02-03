import React from 'react';
import PropTypes from 'prop-types';
// Utilized CSS module to prevent any CSS name collisions in the rest of the app
import styles from '../index.module.css';

function RideAmount({ rideAmount, setRideAmount }) {
  const { formSection, label, inputField, numberField } = styles;
  return (
    <div className={formSection}>
      <label htmlFor="ride-amount">
        <h4 className={label}>How many rides will you need?</h4>
      </label>
      <input
        className={inputField + ' ' + numberField}
        type="number"
        value={rideAmount}
        onChange={(e) => setRideAmount(Number(e.target.value))}
        name="ride-amount"
      />
    </div>
  );
}

RideAmount.propTypes = {
  rideAmount: PropTypes.number,
  setRideAmount: PropTypes.func,
};

export default RideAmount;
