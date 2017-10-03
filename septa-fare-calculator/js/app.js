(function (ng) {

	'use strict';
	
	// MODULE
	ng.module('fareApp', [
	'ngRoute',
	'fareApp.controllers.HomeController',
	'fareApp.services.FareService'])

	// ROUTES
	.config(['$routeProvider', RouteFunction]);

	function RouteFunction(routeProvider) {

		routeProvider

			.when('/', {
				templateUrl: './js/home/home.html',
				controller: 'HomeController',
				controllerAs: 'home'
			})
			.otherwise({
				redirectTo: '/'
			});

	}	

}(angular));
