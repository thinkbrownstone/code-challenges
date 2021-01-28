import React, { Component } from 'react';

export default class FareForm extends Component {
	state = {
		travePeriodInfo: undefined,
		purchaseLocInfo: undefined,
		anytimeRideSelected: false,
	}

	handleSelection = () => {
		
		// grab values from fields
		const zoneSelection = document.getElementById('zoneSelect').value;
		const travelPeriodSelection = document.getElementById('travelPeriodSelect').value;

		let purchaseLocSelection = undefined;

		if(document.getElementById('adPurchase').checked){
			purchaseLocSelection = document.getElementById('adPurchase').value;	
		}
		else {
			purchaseLocSelection = document.getElementById('onPurchase').value;
		}

		let ridesSelection = document.getElementById('rides').value;

		// special case: 
		// cant select 'anytime' and 'onboard' // anytime is sold in packs of 10
		if(travelPeriodSelection === 'anytime'){
			document.getElementById('travelPeriodSelect').value = 'advance_purchase';
			purchaseLocSelection = 'advance_purchase';
			document.getElementById('onPurchase').disabled = true;
			this.setState({
				anytimeRideSelected: true
			})			
		}
		else {
			document.getElementById('onPurchase').disabled = false;
			this.setState({
				anytimeRideSelected: false
			})	
		}

		this.updateHelpTextInfo(travelPeriodSelection, purchaseLocSelection);

		const fareTotal = this.calculateTripFare(zoneSelection,travelPeriodSelection,purchaseLocSelection,ridesSelection);

		this.props.handleSelection(zoneSelection,travelPeriodSelection,purchaseLocSelection,ridesSelection,fareTotal);
	}

	updateHelpTextInfo = (travelPeriodSelection, purchaseLocSelection) => {
		const travelPeriodHelp = this.props.faresData.info[travelPeriodSelection];
		const purchaseLocHelp = this.props.faresData.info[purchaseLocSelection];

		this.setState({
			travePeriodInfo: travelPeriodHelp,
			purchaseLocInfo: purchaseLocHelp,
		})
	}

	calculateTripFare = (zoneSelection,travelPeriodSelection,purchaseLocSelection,ridesSelection) => {

	    const faresData = this.props.faresData;

	    const price = faresData.zones[zoneSelection-1].fares
	      .filter((fare) => 
	        fare.type === travelPeriodSelection)
	          .filter((fare) => 
	            fare.purchase === purchaseLocSelection)[0].price
 
	    // Ensure the total fare returned always shows 2 decimal places
	    return Number(price * ridesSelection).toFixed(2);
  	}

	populateZones = () => {
		return this.props.faresData.zones.map((zone) => 
			<option key={zone.name} value={zone.zone}>{zone.name}</option>
		);
	}
	populateTravelPeriod = () => {
		// Populate travel periods based on JSON object, similar to populateZones above
	}

	// other populate funcs...
	// ideally, we would pull all of the options from the JSON (based on selected zone) with no assumptions about option values.

	componentDidMount() {
		this.updateHelpTextInfo(this.props.selectedTravelPeriod, this.props.selectedPurchaseLoc);
	}


	render() {
		return (
			// Assumptions made in the population of many of the selects and inputs.
			<div className="fares-form">
				<div className="fares-form__section fares-form__zone">
					<label htmlFor="zoneSelect">Where are you going?</label>
					<select id="zoneSelect" onChange={this.handleSelection} value={this.props.selectedFareZone}>
						{this.populateZones()}
					</select>
				</div>

				<div className="fares-form__section fares-form__travel-period">
					<label htmlFor="travelPeriodSelect">When are you riding?</label> 
					<select id="travelPeriodSelect" onChange={this.handleSelection} value={this.props.selectedTravelPeriod}>
						<option key="weekday" value="weekday">Weekday</option>
						<option key="evening_weekend" value="evening_weekend">Evening Weekend</option>
						<option key="anytime" value="anytime">Anytime</option>
					</select>
					{this.state.travePeriodInfo && <div><p className="travel-period-help helptext">{this.state.travePeriodInfo}</p></div>}
				</div>

				<div className="fares-form__section fares-form__purchase-loc">
					<p>Where will you purchase the fare?</p>
					<label htmlFor="adPurchase"><input type="radio" name="purchaseLoc" value="advance_purchase" id="adPurchase" checked={this.props.selectedPurchaseLoc === 'advance_purchase'} onChange={this.handleSelection} />Station Kiosk</label>
					<label htmlFor="onPurchase"><input type="radio" name="purchaseLoc" value="onboard_purchase" id="onPurchase" checked={this.props.selectedPurchaseLoc === 'onboard_purchase'} onChange={this.handleSelection} />Onboard</label>
					{this.state.purchaseLocInfo && <p className="purchase-loc-help helptext">{this.state.purchaseLocInfo}</p>}
				</div>
				
				<div className="fares-form__section fares-form__rides">
					<label htmlFor="rides">How many {this.state.anytimeRideSelected ? <strong>10-ticket packs</strong> : "rides"} will you need?</label>
					<input type="number" id="rides" name="rides" onChange={this.handleSelection} value={this.props.selectedRidesTotal} />
					{this.state.anytimeRideSelected && <p className="helptext">Note that when buying anytime tickets in advance, tickets are sold in packs of 10.</p>}
				</div>
			</div>
			
		);
	}
}