//Creates application
var app = angular
  .module("SeptaFareCalculator", [])
  //Defines controller
  .controller("FaresController", [
    "$scope",
    "$http",
    "$q",
    function($scope, $http, $q) {
      this.helloText =
        "Hello Think Company! This is my submission for the SEPTA Fare calculator. " +
        "This exercise took me exactly one hour and one minute to complete including all code " +
        "and comments seen. I structured the HTML first, then did some quick styling, and finally tied in the logic. " +
        "I was attempting to get the helper text to appear but ran out of time. This was super fun and loved every second! " +
        "Thank you for taking the time to view this submission! ~ Chris Casella";
      console.log(this.helloText);
      //Models for selection on HTML
      $scope.selectedHelperText;
      $scope.selectedZone = null;
      $scope.selectedDay;
      $scope.selectedPurchaseLocation = "onboard_purchase";
      $scope.selectedTicketCount = 1;
      $scope.totalPrice = 0;
      //Only for setting selectedDay variable
      $scope.selectedZoneFares;
      //Data cached from Http call
      $scope.zones;
      $scope.info;
      //For human readable display of names
      $scope.weekTimeNames = [
        {
          display: "Week Day",
          week_value: "weekday"
        },
        {
          display: "Evening Weekend",
          week_value: "evening_weekend"
        },
        {
          display: "Anytime",
          week_value: "anytime"
        }
      ];

      //Fetches JSON data from fares.json and caches data into zones and info variables
      this.getFareData = function() {
        //creates deffered object
        var deferred = $q.defer();

        $http({
          method: "GET",
          url: "fares.json"
        }).then(
          function(res) {
            // console.log(res);
            $scope.zones = res.data.zones;
            $scope.info = res.data.info;
          },
          function(error) {
            console.error(error);
          }
        );

        return deferred.promise;
      };
      //runs on each model update to adjust the price calculation
      $scope.calculateTicketPrice = function() {
        for (var i of $scope.selectedZoneFares) {
          if (
            i.type == $scope.selectedDay &&
            i.purchase == $scope.selectedPurchaseLocation
          ) {
            // console.log(i.price)
            $scope.totalPrice = i.price * $scope.selectedTicketCount;
          }
        }
      };
      //runs on each model update to ensure proper cacluation for calculateTicketPrice
      $scope.handleFormChange = function() {
        if ($scope.selectedZone != null) {
          $scope.selectedZoneFares =
            $scope.zones[$scope.selectedZone - 1].fares;
          $scope.calculateTicketPrice();
        }
      };
      //initializes http call
      this.getFareData();
    }
  ]);
