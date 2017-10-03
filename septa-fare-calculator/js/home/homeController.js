(function (ng) {

	'use strict';

	// MODULE
	ng.module('fareApp.controllers.HomeController', [])

	// HOME CONTROLLER
	.controller('HomeController', ['$scope', 'FareService', HomeController]);

	function HomeController($scope, FareService) {

		// Initializing the fareData
		$scope.fareData = {};

		// Initializing the fare object for scope 
		// with intial data
		$scope.fareObject = {
			zone: 4,
			type: 'weekday',
			trips: 1,
			purchase: 'onboard_purchase',
			totalPrice: 7
		};

		// Get the fareData from FareService
		FareService.getFareData().then(function (data) {

			// Assigning scope fareData from FareService returned data
			$scope.fareData = data;

			// Calculating Fares
			$scope.calculateFares = function () {

				// Zone index is less than zone number by 1
				var zoneIndex = $scope.fareObject.zone - 1;

				// Initializing the fare trips
				var fareTrips = $scope.fareObject.trips;

				// Initializing the fare type
				var fareType = $scope.fareObject.type;

				// Initializing the fare purchase
				var farePurchase = $scope.fareObject.purchase;


				// // Initializing the fare data list				
				var fareDataList = $scope.fareData.zones[zoneIndex].fares;

				// Create the calculateTotalFarePrice function
				// with parameters with the calculation logic
				var calculateTotalFarePrice = function (fareDataList, trips, type, purchase) {

					var currentFare = fareDataList.find(function (fare) {

						return ((fare.type === fareType) &&
							(fare.purchase === farePurchase));

					});

					console.log(currentFare);

					// initializing the total fare price
					var totalFarePrice = 0;

					// Check if trips are greater than 0
					// and if type is not selected as anytime
					// 'coz we have special price
					if ((trips > 0 && type !== 'anytime')) {

						// totalFarePrice will get 2 round digits
						totalFarePrice = (fareTrips * currentFare.price).toFixed(2);
					}

					// Check if trips are equal to 10 'coz we have special price
					if (type === 'anytime' && purchase === 'advance_purchase') {

						// Check if trips mod 10 is greater than 0
						// If not then we will get special price for 10 days
						// and every next 10th day it will calculate the
						// special price by multiplying the division of total trips by 10
						if (trips % 10 >= 0) {

							// totalFarePrice will get 2 round digits
							totalFarePrice = ((fareTrips / 10) * currentFare.price).toFixed(2);

						}
					}
					
					// Assigning totalFarePrice to fareObject's totalPrice in scope					
					$scope.fareObject.totalPrice = totalFarePrice;
					
					// Concole log to test totalFarePrice
					console.log(totalFarePrice);

				}

				// Invoking the calculateTotalFarePrice function
				// with parameters
				calculateTotalFarePrice(fareDataList, fareTrips, fareType, farePurchase);
			}

		});
	}

}(angular));
