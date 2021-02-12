var app = angular.module('fare',[]);

app.controller('fareCtrl',function($scope,$http){


	//Lets pre set all needed data here
	$scope.selectedZone = {};
	$scope.selectedFare = {};
	$scope.selectedInfo = "";
	$scope.disableForSpecialCases = false;

	// for types sake lets assume that all zones have the same type structure
	// if they didnt we would have to run a function to update that
	$scope.types = [
		{
			id:'weekday',
			name:'Weekdays'
		},
		{
			id:'evening_weekend',
			name:'Evening/Weekend'
		},
		{
			id:'anytime',
			name:'Anytime'
		}


	];

	//Lets have the data pre set for them so we don't have to worry about validation
	$scope.formData = {trip:1,purchase:'advance_purchase',zone:"0",type:$scope.types[0].id}
	
	
	// lets make this method private since the user does not need access
	// it will happen on the init
	var getData = function(){
		$http.get('fares.json').then(
			//Success we have the data
			function(data){

				// I am making this a if so if you are not using nodejs this still should work
				if(data.hasOwnProperty('data')){
					data = data.data;
				}

				//the zones will be for the zone selector
				$scope.zones = data.zones;
				$scope.info = data.info;
				$scope.selectedZone = $scope.zones[0];
				updateTotal();
				updateInfo();

				
			},
			function(data){
				//Whoops there was a failure
				console.log('Whoops no data found');
				console.log(data);
			}


		);

	}

	//just a quick function to change the helper info given to the users
	var updateInfo = function(){
		$scope.selectedInfo = $scope.info[$scope.formData.type];

	}
	var updateTotal = function(){
		// set the selectedFare object in here
		setSelectedFare();

		// then we use the selected fares object  to get the price
		var total = $scope.selectedFare.price;
		
		// now we will multiply buy trips
		// then we will use toFixed to show change
		$scope.total = (total * $scope.formData.trip).toFixed(2)
	}

	// this will fund and set the fares based on specifications needed
	var setSelectedFare = function(){
		angular.forEach($scope.selectedZone.fares,function(fare){

			//if it is any time lets set and it do our special case
			if(fare.type == 'anytime' && $scope.formData.type == fare.type){
				$scope.selectedFare = fare;
				setSpecialCase(fare);
				$scope.disableForSpecialCases = true;
			}

			// or just find the fare based on criteria
			else if(fare.purchase == $scope.formData.purchase && fare.type == $scope.formData.type){
				$scope.selectedFare = fare;
				$scope.disableForSpecialCases = false;
			}

			
		});
	}
	//
	var setSpecialCase = function(fare){
		$scope.formData.trip = fare.trips;
		$scope.formData.purchase = fare.purchase;
	}
	

	//PUBLIC FUNCTIONs
	//NG-CHANGES
	$scope.changeZone = function(){
		$scope.selectedZone = $scope.zones[$scope.formData.zone];
		updateTotal();
	}

	// This has special cases
	$scope.changeType = function(){
		
		updateTotal();
		updateInfo($scope.formData.type)
	}
	// Lets keep updateTotal private by wrapping these functions
	$scope.changePurchase = function(){
		updateTotal();
	}
	$scope.changeTrips = function(){
		updateTotal();
	}

	getData();
	
		

});