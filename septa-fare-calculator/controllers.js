
'use strict';

var SeptaCalculator = angular.module("SeptaCalculator", []);


// set the controller to handle our get request to fares.json. use scope to connect with DOM. 
// I then minified the controller and its injections/services with https://javascript-minifier.com/ (trying to start the habit)
SeptaCalculator.controller("SeptaCalculatorController",["$scope","$http",function(t,a){a.get("fares.json").then(function(a){t.fare_data=a.data})}]);
	
	