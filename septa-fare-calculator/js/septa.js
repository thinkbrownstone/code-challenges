(function (angular) {
  'use strict';
  angular.module('septaFareCalculator', [])
    .controller('septaController', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

      $scope.zones = [{
        name: 'Zone 1',
        value: '1'
      }, {
        name: 'Zone 2',
        value: '2'
      }, {
        name: 'Zone 3',
        value: '3'
      }, {
        name: 'Zone 4',
        value: '4'
      }, {
        name: 'Zone 5',
        value: '5'
      }, ]
      var septaRequest = {
        method: 'GET',
        url: 'fares.json'
      }

      $http(septaRequest).then(function successCallback(response) {
        // console.log(response);
        $scope.septaData = response.data;
      }, function errorCallback(response) {});

      $scope.updateFare = function () {
        
        var zone = $scope.zone;
        var type = $scope.type;
        var purchase = $scope.purchase;
        var trips = $scope.trips;

        // Units purchased of tickets is equal to the number of trips
        // except when purchasing 10 tickets, when it is 1 unit of 10 tickets.
        var units = trips;

        var resultZone = $filter('filter')($scope.septaData.zones, {
          zone: zone,
        });

        var resultFare;

        $scope.typeInfo = $scope.septaData.info[type];
        $scope.purchaseInfo = $scope.septaData.info[purchase];

        // The rules about purchasing 10 tickets were weird --
        // here I am assuming that if 10 tickets are purchased it will assume
        // anytime and advanced purchase.
        if (trips % 10 == 0) {
          units = trips / 10;
          resultFare = $filter('filter')(resultZone[0].fares, {
            type: 'anytime',
            purchase: 'advance_purchase',
            trips: '10'
          });
        } else {
          resultFare = $filter('filter')(resultZone[0].fares, {
            type: type,
            purchase: purchase
          });
        }

        // Wasn't sure how to filter at once into a nested object, so I'm
        // pulling the parent object first.
        var resultPrice = resultFare[0].price * units;

        $scope.total = resultPrice;
      };
    }]);
})(window.angular);
