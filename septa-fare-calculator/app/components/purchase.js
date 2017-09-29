'use strict';

import React from 'react';

class Purchase extends React.Component {
	render() {
		return (
			<div className="purchase">
        <div className="question q-purchase">
          Where will you purchase the fare?
        </div>
          <label className="purchase-name">
            <input type="radio" name="purchase" value="station"/>
            Station Kiosk
          </label>
          <label className="purchase-name">
            <input type="radio" name="purchase" value="kiosk"/>
            Onboard
          </label>
      </div>
			)
	}
}

export default Purchase 