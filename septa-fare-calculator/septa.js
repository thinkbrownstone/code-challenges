(function() {

  "use strict";

  // Declare the app
  angular.module('Septa', ['ngInflection']);

  // Define my angular service which returns an object that exposes my promise.
  angular.module('Septa').factory('SeptaAPI', SeptaAPI);
	SeptaAPI.$inject = ["$http"];
  function SeptaAPI($http) {
		return  {
      fareData: getCurrentFares,
    }

    function getCurrentFares() {
      return $http.get(
        // as a vim+screen user, I try to avoid long strings.
        'https://raw.githubusercontent.com' +
        '/thinkbrownstone/code-challenges/master/' +
        'septa-fare-calculator/fares.json'
      );
    };
	}

  // Define my controller which sets all of my variables on $scope.
  angular.module('Septa').controller('FormController', FormController);
  FormController.$inject = ["$scope", 'SeptaAPI'];
  function FormController($scope, SeptaAPI) {

    SeptaAPI.fareData().then(function(response) {
      $scope.zones = response.data.zones;
      $scope.info = response.data.info;
      $scope.times = Object.keys($scope.info);
      $scope.where = 'standard';

      // I began writing the updatePrice method before I looked closely at the
      // zones. I should have known better than to assume there would be a
      // price for every possible combination of variables ...
      $scope.updatePrice = function() {
        $scope.price = calculatePrice(
          $scope.zones,
          $scope.destination,
          $scope.type,
          $scope.purchase,
          $scope.trips
        );
      }

    });
	}

  function calculatePrice( zones, zone, type, purchase, trips) {
    var fareGroup = calculatFareGroup(zones, zone);
    // the if and try below allow us to fail silently rather than throw a
    // console error.
    if (fareGroup) {
      try {
        return calculateFare(fareGroup.fares, type, purchase, trips);
      } catch (e) {
        // console.log( e );
      }
    }
  }

  function calculatFareGroup(zones, zone) {
    return zones.filter(function(z) { return z.zone == zone })[0];
  }

  // Everything below here is ugly. Stop reading now.
  function calculateFare(fareGroup, type, purchase, trips) {
    if (trips % 10 == 0) {
      return fareGroup.filter(function(f) {
        return f.purchase == purchase && f.type == type && f.trips == 10
      })[0].price * (trips/10);
    } else {
      return fareGroup.filter(function(f) {
        return f.purchase == purchase && f.type == type && f.trips == 1
      })[0].price * trips;
    }
  }

})();
