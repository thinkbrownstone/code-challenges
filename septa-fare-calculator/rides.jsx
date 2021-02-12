import React from 'react';

const Rides = ({ ridesAmount, updateRides }) => {
  return(
    <div className="select-rides-container">
      <h2>How many rides will you need?</h2>
      <input
        type="number"
        min="1"
        value={ridesAmount}
        onChange={updateRides}>
      </input>
    </div>
  );
};

export default Rides;
