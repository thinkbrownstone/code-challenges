angular.module('SeptaFareCalculator', [])

/* Service to retrieve the JSON file containing the Septa Rates.
In a larger application, would place this in a separate file. */
.factory('retrieveSeptaRates', ['$http', function($http) {
	return $http.get('fares.json')
	.success(function(data) {
		console.log("Successfully retrieved JSON file");
		return data; 
	})
	.error(function(err) {
		console.log("Error retrieving JSON file");
		return err;
	});
}])

.controller('SeptaFareCalculatorController', ['$scope', 'retrieveSeptaRates', function($scope, retrieveSeptaRates) {
	var septaRateData = {};

	// Retrieve the Septa Rates from the service defined above
	retrieveSeptaRates.success(function(data) {
		septaRateData = data;
	});

	$scope.fareCostCalculator = function(zone, fare_type, purchase_location, quantity) {
		var fareCost = 0;

		//if the quantity is greater than 0, check the other user inputs
		if (quantity > 0) {

			// check the zone
			for (i = 0; i < septaRateData.zones.length; i++) {

				if (septaRateData.zones[i].zone == zone) {
					//check the fare type and purchase location
					for (j = 0; j < septaRateData.zones[i].fares.length; j++) {
						if (septaRateData.zones[i].fares[j].type == fare_type && septaRateData.zones[i].fares[j].purchase == purchase_location) {
							fareCost = septaRateData.zones[i].fares[j].price * quantity;
						}
					}
					break;
				}
			}

		}
		return fareCost;
	};

}]);