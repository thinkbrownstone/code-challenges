import React from 'react';


const Fare = (props) =>
(
	<div className="fare-calc">
		<h3 className="fare-calc__title">Your fare will cost</h3>
		<h2 className="fare-calc__total">${props.totalFare}</h2>
	</div>
);	

export default Fare;
