import React, { useRef } from 'react';
import PropTypes from 'prop-types';
// Utilized CSS module to prevent any CSS name collisions in the rest of the app
import styles from '../index.module.css';

function FarePurchaseLocation({
  farePurchaseLocation,
  setFarePurchaseLocation,
}) {
  const kiosk = useRef(null);
  const onboard = useRef(null);

  const onChange = (e) => {
    setFarePurchaseLocation(e.target.value);
  };

  const { formSection, label, radioLabel, radioButtonsContainer } = styles;

  return (
    <div className={formSection}>
      <legend>
        <h4 className={label}>Where will you purchase the fare</h4>
      </legend>
      <div className={radioButtonsContainer}>
        <div>
          <input
            type="radio"
            name="station-kiosk"
            value="advance_purchase"
            ref={kiosk}
            onChange={onChange}
            checked={
              kiosk.current
                ? kiosk.current.value === farePurchaseLocation
                : false
            }
          />
          <label className={radioLabel} htmlFor="station-kiosk">
            Station Kiosk
          </label>
        </div>
        <div style={{ marginTop: '8px' }}>
          <input
            type="radio"
            name="onboard"
            value="onboard_purchase"
            ref={onboard}
            onChange={onChange}
            checked={
              onboard.current
                ? onboard.current.value === farePurchaseLocation
                : false
            }
          />
          <label className={radioLabel} htmlFor="onboard">
            Onboard
          </label>
        </div>
      </div>
    </div>
  );
}

FarePurchaseLocation.propTypes = {
  farePurchaseLocation: PropTypes.string,
  setFarePurchaseLocation: PropTypes.func,
};

export default FarePurchaseLocation;
