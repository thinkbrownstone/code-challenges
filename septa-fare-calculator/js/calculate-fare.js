$(function() {
	$.ajax({
		url: "https://raw.githubusercontent.com/AyubM/code-challenges/master/septa-fare-calculator/fares.json",
		dataType: "json",
		success: function (data) {
			fares = data;
			
			// Fill drop downs
			var zoneElem = $('select[data-hook="zone"]');
			
			$.each(data.zones, function(key, zone) {
				zoneElem.append(
							$("<option></option")
							.attr("value", zone.zone)
							.text(zone.name));
			});
			
			calculateFare();
			
			// Register callback
			$('select[data-hook="type"]').on('change', function () {
				$('#calculate-fare-type-helper').text(data.info[$(this).val()]);
			});
			
			$('.calculate-fare-field input').on('change', calculateFare);
			$('.calculate-fare-field select').on('change', calculateFare);
		}
	});
});

function calculateFare(data) {
	var zone = parseInt($('select[data-hook="zone"]').val());
	var trips = $('input[data-hook="trips"]').val();
	var type = $('select[data-hook="type"]').val();
	var purchase = $('input[name="purchase"]:checked').val();
	
	// Get our zone
	var theZone = _.findWhere(fares.zones, {zone: zone});
	
	// Get our fare
	if (type == "anytime") {
		// Lock down purchase location and number rides
		$('input[data-hook="trips"]').val(10).prop("disabled", true);
		$('#calculate-fare-purchase-advance').prop("checked", true);
		$('#calculate-fare-purchase-onboard').prop("disabled", true);
		
		// Set result
		var result = _.findWhere(theZone.fares, {type: "anytime", trips: 10, purchase: "advance_purchase"});
		var cost = result.price;
	} else {
		$('input[data-hook="trips"]').prop("disabled", false);
		$('#calculate-fare-purchase-onboard').prop("disabled", false);
		
		var result = _.findWhere(theZone.fares, {type: type, purchase: purchase});
		var cost = result.price * trips;
	}
	
	$('.calculate-fare-result strong').text('$' + cost.toFixed(2));
}