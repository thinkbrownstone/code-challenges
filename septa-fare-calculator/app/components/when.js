'use strict';

import React from 'react';

class When extends React.Component {
	render() {
    const date = this.props.when.info
		const travelTimes = Object.keys(date)
		const travelTime = []
		for (let time =0; time<3; time++){
			travelTime.push(
				<option 
					key={time}
					value={travelTimes[time]}>
					 {travelTimes[time]}
				</option>
				)
		}
		return (
			<div className="when">
				<div className="question q-when">
					When are you traveling?
				</div>
        <select className="when-select">
          {travelTime}
        </select>
      </div>
			)
	}
}

export default When