import React from 'react';

const Purchase = ({ purchaseInfo, selected, updatePurchase }) => {

  return(
    <fieldset className="purchase-selection-container">
      <h2>Where will you purchase the fare?</h2>
      <div className="purchase-radio">
        <input
          type="radio"
          name="radio-purchase"
          value="advance_purchase"
          checked={selected === 'advance_purchase'}
          onChange={updatePurchase}/>
        <label htmlFor="radio-advance-purchase">Station Kiosk</label>
      </div>
      <div className="purchase-radio">
        <input
          type="radio"
          name="radio-purchase"
          value="onboard_purchase"
          checked={selected === 'onboard_purchase'}
          onChange={updatePurchase} />
        <label htmlFor="radio-onboard-purchase">Onboard</label>
      </div>
        <div className="purchase-info">
          <p>{purchaseInfo}</p>
        </div>
    </fieldset>
  );
};

export default Purchase;
