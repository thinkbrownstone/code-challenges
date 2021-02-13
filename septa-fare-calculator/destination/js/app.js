/* Normally I would include JSHint, file concatination etc to make JS dev a little less painful.
*  JQuery and Knockout are included in lib.js
*
*  Due to the modular nature, I opted to use Knockout for the data-binding. It seemed overkill to include an entire framework
*  without needing it.
*
*  I have been running this on a python SimpleHTTPServer to allow for request of the JSON file locally.
*
*/

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

	self.timeHelperText = ko.computed(function() {
		var time = self.readableTimes[self.selectedTime()];
		var text = self.timesJSON()[time];

		return text;
	})

	self.purchaseHelperText = ko.computed(function() {
		var text = self.timesJSON()[self.selectedPurchaseMethod()];

		return text;
	})

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

	self.isAnytime = ko.computed(function() {
		return self.selectedTime() === "Any Time";
	});
	

	self.fareResult = ko.computed(function() {
		var zone = self.selectedZone();
		var time = self.readableTimes[self.selectedTime()];
		var purchaseMethod = self.selectedPurchaseMethod();
		var tripCount = self.rideCountClean();

		// This is awkward and I'd love to re-factor it. Want to try and keep logic out of the view though
		var totalValue = self.isAnytime() ? ["", ""] : "";

		if (typeof zone != "undefined" && typeof time != "undefined" && typeof purchaseMethod != "undefined" && !isNaN(tripCount)) {
			var thisZone =  ko.utils.arrayFilter(self.zonesJSON(), function(zoneObject) {
								return zoneObject.name === zone;
							})[0];

			var thisFare;

			// Due to lack of time, this is where I'd implement the logic for returning info based on 10 rides variations.
			// I'd want to refactor this to push objects instead of strings, and appropriately show all fare possibilities in the view logic
			if (time == "anytime") {
				thisFare =  ko.utils.arrayFilter(thisZone.fares, function(fareObject) {
					return fareObject.purchase === purchaseMethod && fareObject.trips <= tripCount;
				});

				var prices = [];
				for (var i= 0; i < thisFare.length; i++) {
					prices.push(toMoney(thisFare[i].price));
				}

				totalValue = [];
				totalValue = prices;

			} else {
				thisFare =  ko.utils.arrayFilter(thisZone.fares, function(fareObject) {
					return fareObject.purchase === purchaseMethod && fareObject.type == time;
				})[0];

				totalValue = toMoney(thisFare.price * tripCount);
			}
			
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

