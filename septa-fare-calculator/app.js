'use strict';
// in an actual project with more data I would modularize this
// for reviewing purposes however, this is easier to take in I think
window.app = angular.module('FareWidget', []);

// I would have put this in a resolve, because if this was actually async this wouldnt work 
app.controller('FareWidgetCtrl', function($scope, JsonFactory) {
    $scope.fares = JsonFactory.getJsonData();
    $scope.finalCost=5;
    $scope.times = ['weekday','evening_weekend','anytime']
    $scope.where;
    $scope.when;
    $scope.amount =1;
    $scope.purchaseLocation;
    var calculatePrice = function() {
    	var val;
        if ($scope.where && $scope.when) {
            $scope.where.fares.forEach(function(fare) {
            	console.log("fare type"+fare.type)
            	console.log("fare purchase"+fare.purchase)
            	console.log("scope when"+$scope.when)
            	console.log("scope purchase"+$scope.purchaseLocation)
                if (fare.type === $scope.when && fare.purchase === $scope.purchaseLocation){
                    val =fare.price * $scope.amount
                    console.log("in")
                }
               
            })

        }
        return val;
    }

 $scope.$watchCollection('[amount,where,when, purchaseLocation]', function(newValues){
 	
 	$scope.finalCost =calculatePrice()
  });
})

// If this was a full application and I had a backend, I would have a static route set up
// to serve the files up so I could access them like this, so this would work in that case. 
app.factory('JsonFactory', function($http) {
    return {
        getJsonData: function() {

            // return $http.get('/fares.json').then(function(response) {
            //     return response.data
            // })
            return {
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
            }
        }

    }

});
