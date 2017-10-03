(function (ng) {

	'use strict';

	// MODULE
	ng.module('fareApp.services.FareService', [])

	// FARE SERVICE
	.service('FareService', ['$http', FareService]);

	function FareService($http) {

		var self = this;

		self.http = $http;

		self.promise;

	}
	
	FareService.prototype = {
		
		// prototype function for FareService
		// to get fare data from fares.json file
		getFareData: function () {
			if (!this.promise) {
				// $http returns a promise, which has a then function, which also returns a promise
				this.promise = this.http.get('./js/models/fares.json').then(function (response) {
					// The then function here is an opportunity to modify the response
					console.log(response);
					// The return value gets picked up by the then in the controller.
					return response.data;
				});
			}
			
			return this.promise;
		}

	}



}(angular));
