/*
Javascript document that handles interaction with JSON data. 
Written by Roger Martinez
*/
$(document).ready(function(){

//Temporary solution to display default values on page visit.
var default_price = 4.75;

//Prevent entering data with keypress.
$(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

//JSON data loaded with page for reference.
$.getJSON("./fares.json", function(data){

	var zones = data.zones;

	//Load zone options
	$(data.zones).each(function(zone_info){
		$("#zone").append($("<option>", {value: this.zone, text: this.name}));
	});

	$("#price").append("<h2>$" + default_price + "</h2>");

	//Trigger price selection upon menu changes. Should be consolidated into separate function.
	$("#fare_menu").change(function(menu_data){

		var selections = {};

		var options = $(this).serializeArray();

		$(options).each(function(){

			selections[this.name] = this.value;

		})

		//Force advance purchase if 10 tickets selected.
		if(selections.trips > 9)
		{
			    $("input:radio[name=purchase][value=advance_purchase]").prop('checked', true);
			    selections["purchase"] = "advance_purchase";
		}

		/*
			Compare selected elements to JSON data. 
			Should be abstracted and relegated to separate functions.
		*/


		//Compare selected zone to JSON data. 
		var zone_data = "";

		$(zones).each(function(){

			if(this.zone == selections.zone)
			{
				zone_data = this;
			}
		});


		fare_data = new Array();

		//Compare time of day selection. At 10 tickets, "anyime" is default 
		$(zone_data.fares).each(function(){
			if(selections.trips < 10)
			{
				if(this.type == selections.type)
				{
					fare_data.push(this);
				}	
			}
			else
			{
				if(this.type == "anytime")
				{
					fare_data.push(this);
				}
			}
		});

		//Get price	
		var price = "";

		if(selections.trips < 10)
		{
			$(fare_data).each(function(){
				if(this.purchase == selections.purchase)
				{
					price = this.price * selections.trips;
				}	
			});
		}
		else
		{
			$(fare_data).each(function(){
                                if(this.purchase == selections.purchase)
                                {
                                        price = this.price;
                                }
                        });	
		}
		
		price = price.toFixed(2);
		
		console.log(price);

		$("#price").empty();	

		$("#price").append("<h2>$" + price + "</h2>");
	});
});
});
