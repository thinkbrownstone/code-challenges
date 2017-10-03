/*
septacalc.js
Mark Berner
mark@bernerwebcreations.com
25 Feb 2016

Provides all the logic for the septacalc plugin, which calculates fares for SEPTA trips
Assumes we want to display the lowest fare available
TJ said that $0 is never a valid answer, but it is if the user wants to buy 0 trips.
Why would anyone want to use a fare calculator to calculate the cost of not going anywhere?
Who knows? But the first thing my programming teacher tought me in high school is that you can
never assume the user knows anything.
*/

$(function(){
	septacalc.get_data();
});


/*
septa fare calculator object
contains all functions and data needed to calculate septa fares
 */
var septacalc = {
	info: [],
	zones: [],

	/* 
	get_data
		loads initial fare data 
		acivates septa calculator fields once the data is loaded
		this function could use more validation checks, but you asked that we not spend more than an hour on it
		parameters: none
		returns: none
	*/
	get_data: function(){
		var self = this;
		$.get('https://raw.githubusercontent.com/thinkbrownstone/code-challenges/master/septa-fare-calculator/fares.json',
			{},
			function(response){
				//save data
				if('info' in response)
					self.info = response.info;
				if('zones' in response)
					self.zones = response.zones;
				
				//activate fields
				self.activate_fields();
			},
			'json'
		);
	},

	/*
	activate_fields
		acivates form fields for fare calculation
		parameters: none
		returns:
	*/
	activate_fields: function() {
		var self = this;
		$('#septacalc_zone').change(function(){
			self.get_fare();
		});
		$('#septacalc_type').change(function(){
			self.get_fare();
			self.show_type_info();
		});
		$("[name='septacalc_purchase']").change(function(){
			self.get_fare();
			self.show_purchase_info();
		});
		$('#septacalc_trips').change(function(){
			self.get_fare();
		});
		self.get_fare();
		self.show_type_info();
		self.show_purchase_info();
	},

	/*
	get_fare
		calculates the fare for a given set of parameters pulled from form fields
		automatically checks anytime fares to see if they're cheaper than time-specific fares
		displays the fare on the page
		parameters: none
		returns: none
	*/
	get_fare: function() {
		var params = {
			zone: $('#septacalc_zone').val(), 
			type: $('#septacalc_type').val(), 
			purchase: $("input[name='septacalc_purchase']:checked").val(), 
			trips: parseInt($('#septacalc_trips').val())
		};

		//validate trip count
		if(isNaN(params.trips) || params.trips < 0) {
			$('#septacalc_fare').html('Invalid number');
			return;
		}

		//get zone
		var zone = this.get_zone(params.zone);
		// validate zone name
		if(zone == null) {
			$('#septacalc_fare').html("Zone not found");
			return;
		}

		// calculate fare
		var fare = 0;
		var trips_needed = params.trips;
		while(trips_needed > 0) {
			var lowest_fare = this.get_lowest_fare(zone, params.type, params.purchase, trips_needed);

			// check to make sure fares are available
			if(lowest_fare == null) {
				$('#septacalc_fare').html("No fare found");
				return;
			}

			// calculate how many times the user will want to purchase the fare
			var purchases = Math.floor(trips_needed / lowest_fare.trips);
			
			// simulate making the purchase
			fare += lowest_fare.price * purchases;
			trips_needed -= lowest_fare.trips * purchases;
		}

		// display fare
		$('#septacalc_fare').html('$' + fare.toFixed(2));
	},

	/* 
	get_lowest_fare
		gets the lowest fare that matches the parameters the user specified 
		parameters: 
			zone 		Zone they're travelling to
			type 		Type of purchase (weekday, evenings / weekend)
			purchase 	Where they purchase the ticket (kiosk / onboard)
			trips 		Number of trips needed
		returns: lowest fare object
	*/
	get_lowest_fare: function(zone, type, purchase, trips) {
		var answer = null;
		var lowest_fare = null;
		
		//for each fare...
		for(var i=0; i<zone.fares.length; i++)
		{
			fare = zone.fares[i];
			//if the fare matches the parameters...
			if((fare.type == type || fare.type == "anytime") //anytime fares can be applied to any type
				&& fare.purchase == purchase
				&& fare.trips <= trips
			){  
				//and it's the lowest fare found so far...
				var cost_per_trip = fare.price / fare.trips;
				if(lowest_fare == null || cost_per_trip < lowest_fare) {
					//save fare as answer
					answer = fare;
					lowest_fare = cost_per_trip;
				}
			}
		}

		return answer;
	},

	/*
	get_zone
		gets the full zone object for a given zone name
		parameters:
			zone_name 	name of zone
		returns: full zone data
	*/
	get_zone: function(zone_name) {
		for(var i=0; i<this.zones.length; i++)
			if(this.zones[i].name == zone_name)
				return this.zones[i];
		return null;
	},

	/*
	show_type_info
		shows type helper text
		parameters: none
		returns: none
	*/
	show_type_info: function() {
		var type = $('#septacalc_type').val();
		if(type in this.info)
			$('#septacalc_type_info').html(this.info[type]);
	},

	/*
	show_purchase_info
		shows purchase helper text
		parameters: none
		returns: none
	*/
	show_purchase_info: function() {
		var purchase = $("input[name='septacalc_purchase']:checked").val();
		if(purchase in this.info)
			$('#septacalc_purchase_info').html(this.info[purchase]);
	}

} //end septacalc object