var app = angular.module('SeptaApp', []);

app.controller('MainController', function ($scope, $http) {
	
	// get data from fares.json file
	$http.get('fares.json')
	.then(function(res){
		$scope.info = res.data.info;
		$scope.fares = res.data.zones;
	});

	// set default trip
	$scope.myTrip = {
		zone: "1",
		type: "weekday",
		purchase: "advance_purchase",
		trips: 0,
		total: 0
	};

	// calculate total cost of trip on ng-submit
	$scope.submitForm = function () {
		// set current zone purchase is being made from
		var currentZone = $scope.fares[$scope.myTrip.zone-1].fares;
		
		// updated data for my trip
		var myTrip = $scope.myTrip

		// loop through all fares in current zone
		for (var i = 0; i < currentZone.length; i++) {
			var f = currentZone[i];
			// if my trip data matches fares data, calculate total fare for my trip accordingly
			if (f.type === myTrip.type && f.purchase === myTrip.purchase) {
				$scope.myTrip.total = myTrip.trips * f.price;
			}

			// if trip purchase is for anytime and fits rest of profile, set special price to total fare
			if (myTrip.type === "anytime") {
				if (myTrip.trips === 10 && myTrip.purchase === "advance_purchase") {
					$scope.myTrip.total = f.price;
				}
				else {
					$scope.myTrip.total = 0;
				}
			}
		}
	};

});