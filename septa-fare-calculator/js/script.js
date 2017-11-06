window.addEvent('domready', function(){

	$('zone_select').addEvent('change', function(e){
		var zone_value 		= 	e.target.value;
		var departure_value = 	$('departure_select').get('value');
		var purchase_value 	= 	$$("input[type='radio']:checked").map(function(e){ return e.value } )[0];
		var trips_value 	= 	$("numeric").get('value');
		calculateCost(zone_value, departure_value, purchase_value, trips_value);
	});

	$('departure_select').addEvent('change', function(e){
		var departure_value = 	e.target.value;
		var zone_value 		= 	$('zone_select').get('value');
		var purchase_value 	= 	$$("input[type='radio']:checked").map(function(e){ return e.value } )[0];
		var trips_value 	= 	$("numeric").get('value');
		calculateCost(zone_value, departure_value, purchase_value, trips_value);
	});


	$('onboard_purchase').addEvent('click', function(e){
		var purchase_value 	= 	e.target.value;
		var zone_value 		= 	$('zone_select').get('value');
		var departure_value = 	$('departure_select').get('value');
		var trips_value 	= 	$("numeric").get('value');
		calculateCost(zone_value, departure_value, purchase_value, trips_value);

	});

	$('advance_purchase').addEvent('click', function(e){
		var purchase_value 	= 	e.target.value;
		var zone_value 		= 	$('zone_select').get('value');
		var departure_value = 	$('departure_select').get('value');
		var trips_value 	= 	$("numeric").get('value');
		calculateCost(zone_value, departure_value, purchase_value, trips_value);
	});

	$('numeric').addEvent('keyup', function(e){
		var trips_value 	= 	e.target.value;
		var zone_value 		= 	$('zone_select').get('value');
		var departure_value = 	$('departure_select').get('value');
		var purchase_value 	= 	$$("input[type='radio']:checked").map(function(e){ return e.value } )[0];
		calculateCost(zone_value, departure_value, purchase_value, trips_value);

	});

});

var app = new Object();
app.zone = 0;
app.purchase = '';
app.type = '';
app.trip = 1;

function calculateCost(zones, types, purchases, trips){

	app.zone 		= zones - 1;
	app.purchase 	= purchases;
	app.type 		= types;
	app.trip 		= trips;

	var server = new Request.JSON({
		url: 'fares.json',
		type: 'get',
		onSuccess: function( json, xml ){
			console.log(json);
			for( key in json.zones[app.zone].fares){

				if( json.zones[app.zone].fares[key].purchase === app.purchase && json.zones[app.zone].fares[key].type === app.type){
					$( 'numeric-value' ).empty().appendText( json.zones[app.zone].fares[key].price * app.trip );
				}

			}


		}
	});

	server.send();
}