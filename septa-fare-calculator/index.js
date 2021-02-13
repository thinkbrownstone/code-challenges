'use strict';

(function () {

	var fareData = {};

	// all inputs in an array for easy iteration
	var inputs = [
		document.getElementById('zone-select'),
		document.getElementById('when-select'),
		document.getElementById('kiosk-radio'),
		document.getElementById('onboard-radio'),
		document.getElementById('ride-count-input')
	];

	//	fetch data
	ajax('fares.json', initialize);

	// simple ajax function
	function ajax(url, callback) {
		var xmlhttp;
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				callback(xmlhttp.responseText);
			}
		};
		xmlhttp.open('GET', url, true);
		xmlhttp.send();
	}

	// initial setup of UI after data has been fetched
	function initialize(data) {
		fareData = JSON.parse(data);
		addListeners();
		addZoneOptions();
		update();
	}

	// add listeners, with fallbacks for IE8
	function addListeners() {
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i].addEventListener) {
				inputs[i].addEventListener('change', update);
			} else { 
				// IE8 nonsense
				inputs[i].attachEvent('onchange', update);
				inputs[i].attachEvent('onclick', update);
			}
		}
	}

	// set up zone select menu
	function addZoneOptions() {
		var zoneSelect = inputs[0];
		zoneSelect.innerHTML = '';
		for (var i = 0; i < fareData.zones.length; i++) {
			var option = document.createElement('option');
			option.value = i;
			option.innerHTML = fareData.zones[i].name;
			zoneSelect.appendChild(option);
		}
	}

	function getCost() {
		// 1. convert json string to float
		// 2. convert float to fixed (to prevent float errors)
		// 3. multiply cost by ticket quantity
		// 4. convert to fixed with two decimal places for currency
		var costFixed = parseFloat(inputs[4].value).toFixed(2);
		var totalCost = costFixed * getSelectedFare().price / getFareTrips();
		return totalCost.toFixed(2);
	}

	// get the minimum number of trips for selected fare
	function getFareTrips() {
		return getSelectedFare().trips;
	}

	// get purchase location from radio inputs
	function getPurchaseLocation() {
		return inputs[2].checked ? inputs[2].value : inputs[3].value;
	}

	// get fare based on selected type and purchase location
	function getSelectedFare() {
		var fares = fareData.zones[getZone()].fares;
		for (var fare = 0; fare < fares.length; fare++) {
			if (fares[fare].type === getType() && fares[fare].purchase === getPurchaseLocation()) {
				return fares[fare];
			}
		}

		return false;
	}

	// get currently selected fare type (travel time)
	function getType() {
		return inputs[1].value;
	}

	// get currently selected zone
	function getZone() {
		return inputs[0].value;
	}

	function update() {
		// adjust inputs to conform to quantity/location restrictions 
		validateType();
		validateFareCount();

		// update text in UI
		updateCost();
		updateHelperText();
	}

	// update cost in UI
	function updateCost() {
		document.getElementById('cost').innerHTML = '$' + getCost();
	}

	// update cost in UI
	function updateHelperText() {
		var whenHelper = fareData.info[getType()];
		var whereHelper = fareData.info[getPurchaseLocation()];
		document.getElementById('where-helper').innerHTML = whereHelper;
		document.getElementById('when-helper').innerHTML = whenHelper;
	}

	function validateFareCount() {
		// if selected quantity is less than minimum quantity,
		// update quantity to reflect that minimum
		if (inputs[4].value < getFareTrips()) {
			inputs[4].value = getFareTrips();
		}

		// if selected quantity is not divisible by minimum quantity,
		// reduce quantity by remainder
		if (inputs[4].value % getFareTrips() !== 0) {
			inputs[4].value -= inputs[4].value % getFareTrips();
		}

		// update minumum and step based on minimum quantity
		// for browsers that support input type=number
		inputs[4].min = getFareTrips();
		inputs[4].step = getFareTrips();
	}

	// disable onboard purchase option for 'anytime' ticket packs
	function validateType() {
		if (getType() === 'anytime') {
			inputs[2].checked = true;
			inputs[3].checked = false;
			inputs[3].disabled = true;
		} else {
			inputs[3].disabled = false;
		}

	}

})();
