(function() {
    var FareCalculator = angular.module('FareCalculator', []);

    FareCalculator.controller('FareController', function ($scope, $http) {

        // set initial scope values
        $scope.data = {};
        $scope.model = {
            zone: 1,
            when: 'weekday',
            rides: '',
            purchase: 'advance_purchase',
            fareTotal: 0
        };

        $http.get('./fares.json').then(function(res) {
            $scope.data = res.data;
        });

        $scope.calculate = function() {
            if ($scope.model.rides) {
                var zone = $scope.model.zone;
                var rides = parseInt($scope.model.rides) || 0;

                var fares = $scope.data.zones[zone].fares;
                var fare = fares.find(function(el) {
                    return el.purchase == $scope.model.purchase && el.type == $scope.model.when;
                });

                var farePrice = (fare && fare.price) ? fare.price : 0;

                if (fare) { 
                    if (fare.trips == 10 && rides % 10) {
                        // sell in packs of 10 (ex: 5 = 1pk, 12 = 2pk)
                        if (rides % 10 > 0) {
                            $scope.model.fareTotal = Math.ceil(rides/10) * farePrice; 
                        } else {
                            $scope.model.fareTotal = (rides/10) * farePrice; 
                        }                    
                    } else {
                        $scope.model.fareTotal = rides * farePrice;
                    }
                } else {
                    // no fare found for selected options (example case: Anytime, Onboard Purchase)
                    $scope.model.fareTotal = farePrice;
                }

            }
        };
    });
})();