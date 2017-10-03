var fares;

$( document ).ready(function() {
	$.getJSON( "fares.json",{} , function( data ) {
		// Grab data once.
		fares = data;
		/* Hello! */
		
		// This is where I would grab, parse, and store the "info" part of the json to display. Relatively trivial.
	});
});

function CalculateFare() {
	zone = $("#select_desination").val();
	when = $("#select_when").val();
	loc = $("input[name=location]:radio:checked").val();
	number = $("#text_rides").val();
	if ($("#text_rides").val() == "") //In case there is nothing entered, enter 0
		number = 0;
		
	total = 0.00;
	$.each(fares.zones, function (key, value) {
		//Check zone 1-5
		if (value.zone == zone) {
			$.each(value.fares, function (keyFare, valueFare) {
				// This won't work.
				//TODO: I need to mod 10 and find the remainder trips and add those separately ...
				if (number % 10 == 0) {
					// If all of them match up, use discounted 10 price
					if (valueFare.trips == 10 && valueFare.type == when && valueFare.purchase == loc) {
						total = valueFare.price * (number / 10);
						return;
					}
				}
				// Otherwise, return the normal going rate
				if (valueFare.type == when && valueFare.purchase == loc) {
					total = valueFare.price * number;
					return;
				}
			});
		}
	});
	// Format price and insert into the HTML
	$("#total").html("$" + total.toFixed(2));
}

/*
	Originally, I had an idea to pull the form elements from the jquery but I underestimated the effort it would take to parse it into anything usable
*/