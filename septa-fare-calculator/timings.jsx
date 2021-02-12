import React from 'react';

const Timings = ({ timeInfo, updateTime }) => {
  return (
    <div className="timings-selection-container">
      <h2>When are you going?</h2>
        <select className="selection-form" name="timings-select-form" onChange={updateTime}>
          <option value="weekday">Weekday</option>
          <option value="evening_weekend">Evening weekend</option>
          <option value="anytime">Anytime</option>
        </select>
        <div className="schedule-info">
          <p>{timeInfo}</p>
        </div>
    </div>
  );
}

export default Timings;
