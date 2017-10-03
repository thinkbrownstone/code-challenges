// JavaScript Document

var myApp = angular.module('myApp', []);

myApp.controller('faresCalCtrl', function($scope, $http) {
	//init setup
	//where, set to the first zone in the fares.json
	//when, set to the first type in fares.json
	//where purchase set to the first purchase in fare.json
	$scope.zone = 0;
	$scope.type = 0;
	$scope.purchase = 0;
	
	//init buy one pass
	$scope.rides = 1;
	$scope.minRides = 1;
	
	//init holders for where, when and purchase methods
	$scope.zones = [];
	$scope.types = [];
	$scope.purchases = [];
	
	//init display zone 1 on web page load
	for (var i = 0; i < fares.zones.length; i++) {
		$scope.zones.push(fares.zones[i].name);
	}
	
	//find all possible when riding type for the zone 1
	//in case riding type may different for different zones
	// some zones may only can ride on weekdays, or otherwise
	var types = [];
	for (var i = 0; i < fares.zones[$scope.zone].fares.length; i++) {
		types.push(fares.zones[$scope.zone].fares[i].type);
	}
	$scope.types = types.filter(onlyUnique);
	
	//find all possible purchase methods for the zone 1 and riding time
	//in case some purchase methods may not available for above
	//for instance, onborad_ourchase is not available for anytime ride type
	var purchaseLocs = [];
	for (var i = 0; i < fares.zones[$scope.zone].fares.length; i++) {
		if (fares.zones[$scope.zone].fares[i].type == $scope.types[$scope.type]) {
			purchaseLocs.push(fares.zones[$scope.zone].fares[i].purchase);
		}
	}
	$scope.purchases = purchaseLocs.filter(onlyUnique);
	var validatedRides = minRides($scope.zone, $scope.types[$scope.type], $scope.purchases[$scope.purchase], $scope.rides);
	$scope.rides = validatedRides.validatedRides;
	setTotalFare();
	
	//when changing where to go
	//find possible riding types
	//find possible purchase methods
	$scope.changeWhere = function(whereIdx) {
		$scope.zone = whereIdx;
		$scope.type = 0;
		$scope.purchase = 0;
		$scope.rides = 1;
		$scope.types = possibleWhen($scope.zone);
		$scope.purchases = possiblePurchaseMethods($scope.zone, $scope.types[$scope.type]);
		var validatedRides = minRides($scope.zone, $scope.types[$scope.type], $scope.purchases[$scope.purchase], $scope.rides);
		$scope.rides = validatedRides.validatedRides;
		setTotalFare();
	}
	
	//when changing when to ride
	//find possible purchase methods
	//in case some purchase methods may not available for the riding type
	//for instance, onboard_purchase is not available for anythime riding
	$scope.changeWhen = function(whenIdx) {
		$scope.type = whenIdx;
		$scope.purchase = 0;
		$scope.rides = 1;
		$scope.purchases = possiblePurchaseMethods($scope.zone, $scope.types[$scope.type]);
		var rideValidated = minRides($scope.zone, $scope.types[$scope.type], $scope.purchases[$scope.purchase], $scope.rides);
		//$scope.warning = rideValidated.error;
		$scope.rides = rideValidated.validatedRides;
		$scope.minRides = rideValidated.minRides;
		setTotalFare();
	}
	
	//when purchase method change
	$scope.changePurchase = function(purchaseIdx) {
		$scope.purchase = purchaseIdx;
		setTotalFare();
	}
	
	//when pass number changed
	$scope.changePassNum = function(num) {
		$scope.rides = num;
		setTotalFare();
	}
	
	$scope.validateRides = function() {
		var rideValidated = minRides($scope.zone, $scope.types[$scope.type], $scope.purchases[$scope.purchase], $scope.rides);
		$scope.warning = rideValidated.error;
		$scope.rides = rideValidated.validatedRides;
		$scope.minRides = rideValidated.minRides;
		setTotalFare();
	}
	
	$scope.buySubmit = function() {
		var rideValidated = minRides($scope.zone, $scope.types[$scope.type], $scope.purchases[$scope.purchase], $scope.rides);
		$scope.warning = rideValidated.error;
		$scope.rides = rideValidated.validatedRides;
		$scope.minRides = rideValidated.minRides;
		setTotalFare();
		
		if (!$scope.warning) {
			var data = {};
			data.zone = $scope.zones[$scope.zone].name;
			data.type = $scope.types[$scope.type];
			data.purchase = $scope.purchases[$scope.purchase];
			data.rides = $scope.rides;
			data.totalFare = $scope.totalFare;
			alert("Total fare is sent as JSON string to backend by AngularJS HTTP service: " + JSON.stringify(data));
			//below codes are for sending a JSON result to the back-end by post method
			/*
			$http({
				method  : 'POST',
				url     : 'servlit',
				data    : $.param(JSON.stringify(data)),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
			})
			.then(function(response) {
				console.log(JSON.stringify(response.data));
			});
			*/
		}
	}
	
	function setTotalFare() {
		var zoneFares = fares.zones[$scope.zone].fares;
		var purchaseType = $scope.types[$scope.type];
		var purchaseLoc = $scope.purchases[$scope.purchase];
		$scope.totalFare = fareCal(zoneFares, purchaseType, purchaseLoc, $scope.rides);
	}
});

function minRides(zone, when, purchaseMethod, rides) {
	var ridesValidation = {minRides: 1, validatedRides: 1, error: 0};
	//var minRides = 1;
	for (var i = 0; i < fares.zones[zone].fares.length; i++) {
		if (fares.zones[zone].fares[i].type == when && fares.zones[zone].fares[i].purchase == purchaseMethod) {
			ridesValidation.minRides = fares.zones[zone].fares[i].trips;
			ridesValidation.validatedRides = Math.ceil(rides / fares.zones[zone].fares[i].trips) * fares.zones[zone].fares[i].trips;
			if (rides < ridesValidation.validatedRides) {
				ridesValidation.error = 1;
			}
		}
		
	}
	return ridesValidation;
}

function possiblePurchaseMethods(zone, when) {
	var purchaseMethods = [];
	
	for (var i = 0; i < fares.zones[zone].fares.length; i++) {
		if (fares.zones[zone].fares[i].type == when) {
			purchaseMethods.push(fares.zones[zone].fares[i].purchase);
		}
	}
	return purchaseMethods;
}

function possibleWhen(zone) {
	var possibleRidingTime = [];
	for (var i = 0; i < fares.zones[zone].fares.length; i++) {
		possibleRidingTime.push(fares.zones[zone].fares[i].type);
	}
	possibleRidingTime = possibleRidingTime.filter(onlyUnique);
	return possibleRidingTime;
}

function fareCal (faresAtZone, type, loc, rides) {
	var totalFare = 0;
	
	var price = 0;
	var totalFare = 0;
	for (var i = 0; i < faresAtZone.length; i++) {
		if (faresAtZone[i].type == type && faresAtZone[i].purchase == loc) {
			price = faresAtZone[i].price;
			totalFare = price * rides / faresAtZone[i].trips;
		}
	}
	
	return totalFare.toFixed(2);
}


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

var fares = {
    "info": {
        "anytime": "Valid anytime",
        "weekday": "Valid Monday through Friday, 4:00 a.m. - 7:00 p.m. On trains arriving or departing 30th Street Station, Suburban and Jefferson Station",
        "evening_weekend": "Valid weekdays after 7:00 p.m.; all day Saturday, Sunday and major holidays. On trains arriving or departing 30th Street Station, Suburban and Jefferson Station",
        "advance_purchase": "Tickets available for purchase at all SEPTA offices.",
        "onboard_purchase": "Tickets available for purchase from a train conductor aboard SEPTA regional rail trains."
    },
    "zones": [{
        "name": "CCP/1",
        "zone": 1,
        "fares": [{
            "type": "weekday",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 4.75
        }, {
            "type": "weekday",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 6.00
        }, {
            "type": "evening_weekend",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 3.75
        }, {
            "type": "evening_weekend",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 5.00
        }, {
            "type": "anytime",
            "purchase": "advance_purchase",
            "trips": 10,
            "price": 38.00
        }]
    }, {
        "name": "Zone 2",
        "zone": 2,
        "fares": [{
            "type": "weekday",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 4.75
        }, {
            "type": "weekday",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 6.00
        }, {
            "type": "evening_weekend",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 3.75
        }, {
            "type": "evening_weekend",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 5.00
        }, {
            "type": "anytime",
            "purchase": "advance_purchase",
            "trips": 10,
            "price": 45.00
        }]
    }, {
        "name": "Zone 3",
        "zone": 3,
        "fares": [{
            "type": "weekday",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 5.75
        }, {
            "type": "weekday",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 7.00
        }, {
            "type": "evening_weekend",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 5.00
        }, {
            "type": "evening_weekend",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 7.00
        }, {
            "type": "anytime",
            "purchase": "advance_purchase",
            "trips": 10,
            "price": 54.50
        }]
    }, {
        "name": "Zone 4",
        "zone": 4,
        "fares": [{
            "type": "weekday",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 6.50
        }, {
            "type": "weekday",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 8.00
        }, {
            "type": "evening_weekend",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 5.00
        }, {
            "type": "evening_weekend",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 7.00
        }, {
            "type": "anytime",
            "purchase": "advance_purchase",
            "trips": 10,
            "price": 62.50
        }]
    }, {
        "name": "NJ",
        "zone": 5,
        "fares": [{
            "type": "weekday",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 9.00
        }, {
            "type": "weekday",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 10.00
        }, {
            "type": "evening_weekend",
            "purchase": "advance_purchase",
            "trips": 1,
            "price": 9.00
        }, {
            "type": "evening_weekend",
            "purchase": "onboard_purchase",
            "trips": 1,
            "price": 10.00
        }, {
            "type": "anytime",
            "purchase": "advance_purchase",
            "trips": 10,
            "price": 80.00
        }]
    }]
};