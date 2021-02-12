/*

Septa Fare Calculator

HTML/CSS Requirements:
	- accessibility: screen readers should handle the form, helper text, etc.

JavaScript
	- request fares.json
	- update fare as Zone, Time of Week, Where purchased change

*/


$(document).ready(function() {

	// instantiate fares variable
	var fares;

	//=========================================================================
	// load fares.json
	function loadFares(cb) {
		$.getJSON('fares.json', function(data) {
			console.log(data);
			fares = data;
			cb();
		})

	}

	//=========================================================================
	// Load fares and show price
	loadFares(function() {
		updateFare();
	});

	//=========================================================================
	// update fare
	// 
	// Gets the variables from the dropdowns and inputs
	function updateFare() {
		var fareVariables = {};
		
		// get zone
		fareVariables.zone = $('#fc-zone').val();

		// get time
		fareVariables.time = $('#fc-time').val();

		// get where purchase will happen
		fareVariables.where = $('input[name="fc-where"]').val();

		// get quantity
		fareVariables.quantity = $('#fc-quantity').val();

		// updates the fare displayed
		getFare(fareVariables);
	}

	//=========================================================================
	// get fare
	// 
	// Given user input, determine the price per ticket and populate fare total
	function getFare(variables) {
		var zone = fares.zones.filter(obj => obj.zone == variables.zone)[0];
		var price = zone.fares.filter(obj => obj.type == variables.time && obj.purchase == variables.where)
		
		var cost = Number(price[0].price) * variables.quantity;
		var string = '$' + cost.toFixed(2);
		$('.fc-fare-total').empty().append(string)
	}

	//=========================================================================
	// Update fare when any of the inputs is changed
	$('#fc-zone, #fc-time, input[name="fc-where"], #fc-quantity').on('change', function() {
		updateFare();
	});

});



