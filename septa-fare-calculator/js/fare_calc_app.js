;(function() {
    var septaFareCalcApp = angular.module('fareCalculatorApp', []);

    septaFareCalcApp.controller('fareFormCtlr', ['$scope', '$http', function($scope, $http) {
        var api = '/fares.json';

        // initial values
        $scope.zone = 0;
        $scope.type = "anytime";
        $scope.purchase = "advance_purchase";

        // fetch fares.json
        $http.get(api).then(function(res) {

            // assign the returned data to fares
            $scope.fares = res.data;

            // A call to this is bound to the h1 in the footer of the container
            // In a larger app, this would get put into its own service, but in this case it's kept here for simplicity
            $scope.getPrice = function() {

                // returns the cost of a given number of tickets
                var calcPrice = function(fareType) {
                    
                    // accounts for purchase of anytime tickets, which come in multiples of 10
                    var mult = Math.floor($scope.numRides / $scope.fares.zones[$scope.zone].fares[fareType].trips);

                    // finds the correct fare object and calculates the price
                    return $scope.fares.zones[$scope.zone].fares[fareType].price * mult;
                };

                // Finds the right fare based on the type and purchase, then returns the calculated price
                if ($scope.type === "weekday" && $scope.purchase === "advance_purchase") {
                    return calcPrice(0);
                }
                else if ($scope.type === "weekday" && $scope.purchase === "onboard_purchase") {
                    return calcPrice(1);
                }
                else if ($scope.type === "evening_weekend" && $scope.purchase === "advance_purchase") {
                    return calcPrice(2);
                }
                else if ($scope.type === "evening_weekend" && $scope.purchase === "onboard_purchase") {
                    return calcPrice(3);
                }
                else if ($scope.type === "anytime") {
                    return calcPrice(4);
                }
                else {
                    // if nothing is matched, the price should display 0
                    return 0;
                }
            };
        });
    }]);
})();
