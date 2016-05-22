// Normally I would include JSHint, file concatination etc to make JS dev a little less painful.
// JQuery and Knockout are included in lib.js

function SeptaViewModel() {
	var self = this;

	self.timesJSON = ko.observableArray();
	self.zonesJSON = ko.observableArray();

	self.selectedZone = ko.observable();
	self.selectedTime = ko.observable();
	self.selectedPurchaseMethod = ko.observable();
	self.rideCountRaw = ko.observable();
	self.rideCountClean = ko.computed(function() {
		var value = Number(self.rideCountRaw());

		return value;
	});
	
	self.readableTimes = {
		"Weekdays": "weekday",
		"Evenings / Weekends": "evening_weekend",
		"Any Time" : "anytime"		
	}

	self.timesOptions = ko.computed(function() {
		var keys = Object.keys(self.readableTimes);
		return keys;
	});

	self.availableZones = ko.computed(function() {
		var options = [];
		ko.utils.objectForEach(self.zonesJSON(), function(index, zoneObject) {
			options.push(zoneObject.name);
		})
		return options;
	});
	
	var toMoney = function(num){
		return '$' + (num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') );
	};
	

	self.fareResult = ko.computed(function() {
		var zone = self.selectedZone();
		var time = self.readableTimes[self.selectedTime()];
		var purchaseMethod = self.selectedPurchaseMethod();
		var tripCount = self.rideCountClean();
		var totalValue = "";

		if (typeof zone != "undefined" && typeof time != "undefined" && typeof purchaseMethod != "undefined" && !isNaN(tripCount)) {
			var thisZone =  ko.utils.arrayFilter(self.zonesJSON(), function(zoneObject) {
								return zoneObject.name === zone;
							})[0];

			var thisFare =  ko.utils.arrayFilter(thisZone.fares, function(fareObject) {
								return fareObject.purchase === purchaseMethod && fareObject.type == time;
							})[0];

			totalValue = toMoney(thisFare.price * tripCount);
			
		}
		
		return totalValue;
	});
}

var septaViewModel = new SeptaViewModel();

ko.applyBindings(septaViewModel);

$.ajax({
      url: "/fares.json",
      dataType: "json",
      success: function(data) {
           septaViewModel.timesJSON(data.info);
           septaViewModel.zonesJSON(data.zones);
      }
});

