var fareCalculator = angular.module('fareCalculator', [])

	

	.controller('fcController', ['$scope', '$http', function($scope, $http) {

		/* initialize things */
		$scope.fare = null;
		$scope.fareData = {}
		
		/* load our data aync, but then set things up synchronously */
    	$http.get('./fares.json')
    		.then(function(res){
    			$scope.fareData = res.data;
    		})
    		.finally(function(){
    			$scope.fcMain();
    		});

  		
    	/* our main setup function - set initial values and scope for inputs */
    	$scope.fcMain = function() {

			/* don't hard code zones - just in case */
			$scope.zones = [];
			for(var z = 0; z < $scope.fareData.zones.length; z ++){
				$scope.zones.push({ "zone": z, "name": $scope.fareData.zones[z].name});
				//$scope.zones.push({ "zone": $scope.fareData.zones[z].zone, "name": $scope.fareData.zones[z].name});
			}

    		/* defaults */
    		$scope.fcMain.fcWhere = $scope.zones[0].zone.toString();
    		$scope.fcMain.fcWhen = "weekday";
    		$scope.fcMain.fcWhenInfo = $scope.fareData.info["weekday"];
    		
    	};


    	/* calculate fair based on changed values - if we have them all */
		$scope.calculate = function(){

			$scope.fare = null;
			$scope.tips();

			if($scope.fcMain.fcWhere !== undefined &&
			   $scope.fcMain.fcWhen !== undefined &&
			   $scope.fcMain.fcPurchase !== undefined &&
			   $scope.fcMain.fcRides !== undefined) {

					var zoneIndex = $scope.fcMain.fcWhere;
					var type = $scope.fcMain.fcWhen;
					var purchase = $scope.fcMain.fcPurchase;
					var rides = $scope.fcMain.fcRides;

					var fares = $scope.fareData.zones[zoneIndex].fares;

					for(var f = 0; f < fares.length; f++){
						if(fares[f].type === type && fares[f].purchase === purchase){
			
							$scope.fare = ("$" + (rides * fares[f].price).toFixed(2)).toString();

						}
					}


	    	}

    	};


    	/* show any tip text */
    	$scope.tips = function(){
    		$('#fc-when-info').html($scope.fareData.info[$scope.fcMain.fcWhen]);
    	}
    	



	}]);



/* prototypes */
Object.prototype.isEmpty = function() {
	for(var key in this){
		if(this.hasOwnProperty(key)){
			return false;
		}
	}
	return true;
};