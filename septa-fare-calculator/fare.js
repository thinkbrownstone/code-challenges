//Globally accessable variables to store json information
var regional_rail_trips = [];	//information about zones, tickets, prices.
var regional_rail_info = [];	//information for help text.

//Vaious input fields from the form.
var regional_rail_zone_input;
var regional_rail_time_input;
var regional_rail_purchase_input;
var regional_rail_ride_input;
//Price field used to show results
var regional_rail_ride_price;

jQuery(document).ready(function() {
	set_regional_rail_values("fares.json");
});

//Set the values of regional rail variables based on json.
function set_regional_rail_values(url) {
	jQuery.getJSON( url, function( data ) {
		regional_rail_trips = data.zones;
		regional_rail_info = data.info;

		regional_rail_zone_input = jQuery('#regional-rail-zone');
		regional_rail_time_input = jQuery('#regional-rail-time');
		regional_rail_purchase_input = jQuery('input[name=regional-rail-purchase]');
		regional_rail_ride_input = jQuery('#regional-rail-rides');
		regional_rail_ride_price = jQuery('#regional-rail-fare-price');

		set_regional_rail_form();
	});
}

//Set up form once ajax is loaded
function set_regional_rail_form() {

	set_regional_rail_change_events();
}


function set_regional_rail_change_events(){

	jQuery(regional_rail_zone_input).on('change', function(){
		check_regional_rail_price();
	});

	jQuery(regional_rail_time_input).on('change', function(){

		jQuery('#regional-rail-help-text-time').text(regional_rail_info[regional_rail_time_input.val()]);
		check_regional_rail_price();
	});

	jQuery(regional_rail_purchase_input).on('change', function(){

		jQuery('#regional-rail-help-text-purchase').text(regional_rail_info[jQuery('input[name=regional-rail-purchase]:checked').val()]);
		check_regional_rail_price();
	});

	jQuery(regional_rail_ride_input).on('change', function(){
		check_regional_rail_price();
	});

	check_regional_rail_price();
}

function check_regional_rail_price() {

	//Check if anytime is selected if so limmit purchase to 10
	if(regional_rail_time_input.val() == 'anytime'){
		jQuery('#regional-rail-advanced').attr("checked", true);
		regional_rail_ride_input.val(10);
		regional_rail_purchase_input.attr("disabled", true);
		regional_rail_ride_input.attr("disabled", true);
	}else if(regional_rail_purchase_input.attr("disabled") || regional_rail_ride_input.attr("disabled")){
		regional_rail_ride_input.val(1);
		regional_rail_purchase_input.attr("disabled", false);
		regional_rail_ride_input.attr("disabled", false);
	}

	//read in values of inputs
	var regional_zone_number = regional_rail_zone_input.val();
	var regional_type = regional_rail_time_input.val();
	var regional_purchase = jQuery('input[name=regional-rail-purchase]:checked').val();
	var regional_rides = regional_rail_ride_input.val();
	var regional_trip_cost = '----';

	//only check if rides has a positive value
	 if(regional_rides != 0){
	 	/*
		 * Iterate through all zones to find the one matching the users.
		 *
		 * Side note: this could also be accomplished be reffering to 
		 * regional_rail_trips[regional_zone_num-1] but I wanted to include 
		 * this if more zones are added in the future.
		 */
		 regional_rail_trips.forEach(function(regional_zone, regional_zone_index){
			if(regional_zone.zone == regional_zone_number){
				//iterate through each fare for the correct price.
				regional_zone.fares.forEach(function(regional_fare, regional_fare_index){
					//when ride type and purchase location match return price

					if(regional_fare.type == regional_type && regional_fare.purchase == regional_purchase){
						/*
						 * Check if anytime package of 10 tickets. 
						 * If so return package price otherwise calculate the price.
						 */

						if (regional_type == "anytime"){
							regional_trip_cost = regional_fare.price;
						}
						else{
							regional_trip_cost = regional_fare.price * regional_rides;
						}
					}
				});
			}
		});
	}

	//return result in poper format or empty
	if(regional_trip_cost != '----')
		regional_trip_cost = '$' + Number(regional_trip_cost).toFixed(2);


	//Update the current value of price
	regional_rail_ride_price.text(regional_trip_cost);
}
