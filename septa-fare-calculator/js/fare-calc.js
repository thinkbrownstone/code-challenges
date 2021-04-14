var app = new Vue({
	el: '.fare-calc',
	data: {
		ready: false,
		fareData: {},
		statusMessage: "Loading...",
		cost: 0,
		triggeredAnytime: false,
		// User defaults
		user: {
			zone: 3,
			travelTime: "weekday", // type
			purchaseLocation: "onboard_purchase", // purchase
			ticketCount: 4,
		},
		// Provide human labels for JSON keys
		travelTimeOptions: {
			anytime: "Anytime",
			weekday: "Weekday",
			evening_weekend: "Evening/Weekend",
		},
		purchaseLocationOptions: {
			advance_purchase: "Station Kiosk",
			onboard_purchase: "Onboard",
		},
		// Bulk discount
		bulkDiscountOn: {
			type: "anytime",
			purchase: "advance_purchase",
			trips: 10,
			note: "Available only in quantities of 10 at the Station Kiosk",
		},
	},
	mounted: function () {
		var self = this;
		// Added "fake" loading time
		setTimeout(function(){
			self.$http.get('https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json').then(response => {
				self.fareData = response.body;
				self.calcCost();
				self.ready = true;
				self.fareData.info.anytime = self.fareData.info.anytime + " (" + self.bulkDiscountOn.note + ")";
			}, response => {
				self.statusMessage = "Error loading source data: " + response.statusText + " (" + response.status + ")";
				self.ready = false;
			});
		}, 1000);

	},
	methods: {
		calcCost: function() {
			var self = this;
			if (this.user.ticketCount == 0) {
				this.cost = false;
				this.statusMessage = "Select a number of rides";
				return;
			}
			if (this.user.travelTime == this.bulkDiscountOn.type) {
				if (!this.triggeredAnytime) {
					this.user.purchaseLocation = this.bulkDiscountOn.purchase;
					this.user.ticketCount = Math.ceil(this.user.ticketCount / 10) * 10;
					this.ticketStep = this.bulkDiscountOn.trips;
					this.triggeredAnytime = true;
				}
			} else {
				this.triggeredAnytime = false;
				this.ticketStep = 1;
			}
			var cost = this.fareData.zones[this.user.zone].fares.filter(function(fare) {
				return fare.type == self.user.travelTime &&
					fare.purchase == self.user.purchaseLocation;
			});
			if (typeof cost[0] !== 'undefined') {
				this.cost = (cost[0].price / this.ticketStep) * this.user.ticketCount;
			} else {
				this.cost = false;
				this.statusMessage = "This fare isn't available";
			}
		},
	},
	computed: {
		costHint() {
			var self = this;
			if (this.ready && this.user.travelTime != this.bulkDiscountOn.type) {
				var bulkCost = this.fareData.zones[this.user.zone].fares.filter(function(fare) {
					return fare.type == self.bulkDiscountOn.type;
				});
				if (this.cost > bulkCost[0].price) {
					// Round needs more logic as to floor/ceil
					return "Buying " + (Math.round(this.user.ticketCount / this.bulkDiscountOn.trips) * this.bulkDiscountOn.trips) + " " + this.travelTimeOptions[this.bulkDiscountOn.type] +  " tickets (" + this.purchaseLocationOptions[this.bulkDiscountOn.purchase] + " only) would be cheaper";
				}
			}
		},
		travelTimeHint() {
			if (this.ready) {
				return this.fareData.info[this.user.travelTime];
			}
		},
		userProperties() {
			return this.user.zone,
				this.user.travelTime,
				this.user.purchaseLocation,
				this.user.ticketCount,
				Date.now();
		},
	},
	watch: {
		userProperties: function() {
			this.calcCost();
		}
	}
});