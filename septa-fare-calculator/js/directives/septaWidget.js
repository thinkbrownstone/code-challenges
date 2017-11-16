angular.module('septaApp').directive('septaWidget', function () {
    return {
        replace: true,
        restrict: "E",
        templateUrl: './views/directives/septaWidget.html',
        controller: function ($http, $scope) {
            // setting up default values
            $scope.selectedZone = 0;
            $scope.selectedTime = 0;
            $scope.selectedPurchase = 0;
            $scope.selectedRides = 1;
            $scope.price = '';

            // function to be called for any changes to widget, calculates price and displays it.
            $scope.checkPrice = function () {
                // setting additional texts to be set to correct values for user
                $scope.timeAddt = $scope.times[$scope.selectedTime].info;
                $scope.purchaseAddt = $scope.purchaseTypes[$scope.selectedPurchase].info;

                // setting up function variables for readability
                var time = $scope.times[$scope.selectedTime].value;
                var purchaseType = $scope.purchaseTypes[$scope.selectedPurchase].value;

                // finds fares array for correct zone and then loops over each to check for a match
                $scope.zones[$scope.selectedZone].fares.forEach(function (fare) {
                    // if the selected time is anytime then..
                    if(time === 'anytime' && fare.type === 'anytime') {
                        // ..sets rides to 10..
                        $scope.selectedRides = 10;
                        // and purchase type to the first option (advanced purchase) with its additional text as they are the only options for anytime
                        $scope.selectedPurchase = 0;
                        $scope.purchaseAddt = $scope.purchaseTypes[$scope.selectedPurchase].info;
                        //price can only be one thing for anytime tickets so no calculation to do
                        $scope.price = fare.price;
                        // to prevent user from trying to change ride amount or purchase type this changes anytimeDisable to true and disables those fields
                        $scope.anytimeDisable = true;
                    // once it finds a match and it is not a anytime option..
                    } else if (fare.type === time && fare.purchase === purchaseType) {
                        // multiplies price times the amount of rides selected for this type of ticket and updates price in HTML
                        $scope.price = fare.price * $scope.selectedRides;
                        // no restrictions on these ticket types so want to make sure the user can interact freely with all fields
                        $scope.anytimeDisable = false;
                    }
                });
            }

            // making server call, or in this case just fetching the JSON
            $http.get('./fares.json').then(function (response) {
                // assigning the data to it's on variable so I don't have to say "response.data.xyz" everytime I reference the data
                var data = response.data;

                // setting arrays for ngRepeats that will be used in the HTML to avoid making everything static in case of changes
                $scope.zones = data.zones;
                $scope.times = data.times;
                $scope.purchaseTypes = data.purchaseTypes;

                // lastly call calculating function to get default value for price
                $scope.checkPrice();
            });
        }
    };
});
