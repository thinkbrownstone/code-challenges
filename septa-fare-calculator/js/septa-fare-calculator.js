// main js file

// create globaljson variable to store it so we don't have to call it multiple times
var globaljson;

// when page is ready
$(function () {
	
	// create number spinner ( query ui component ) for how many rides section, 
    var spinner = $(".spinner").spinner({
		min: 1,
	  	max: 50
	});
	
	// load in the json file
	$.ajax({
		type: "GET",
		dataType: 'json',
		url: 'fares.json',
		success: function(jsonobject){
			
			//assign json load file to globaljson variable
			globaljson = jsonobject;
			
			// add zone names to 'where are you going' dropdown
			$.each(globaljson.zones , function(key , value){ 
				$('#zoneName').append($('<option>', { value: value.zone, text: value.name })); 
			});
			
			//call populate initial cost function
			populateIntialCost();
		}
	});
	
	
	//if 'where are you going' dropdown field changes, call populate cost onchange function
	$('#zoneName').on('change', function(e) {
        populateCostOnChange();
	});
	
	//if 'when are you riding' dropdown field changes, call populate cost onchange function
	$('#whenRiding').on('change', function(e) {
        populateCostOnChange();
	});
	
	//if 'where will you purchase the fare' checkboxes change, call populate cost onchange function
	$('.ui-spinner-button').on('click', function(e) {
        populateCostOnChange();
	});
	
	//if 'how many rides will you need' dropdown field changes, call populate cost onchange function
	$('input[name=purchaseLocation]').change(function(e) {
		populateCostOnChange();
	});
});


//function populate initial cost
function populateIntialCost() {
	
	// initialize current price per ride to zero, make sure whenready is empty
	var currentPricePerRide = 0;
	
	// grab the current 'where are you going' value
	var currentZone = $("#zoneName").val();
	
	// create empty array for the fares section for 'when are you going'
	var faresArray = [];
	
	
	// if the current zone isn't empty
	if( currentZone !== "" || currentZone !== null  ) {
		$.each(globaljson.zones[currentZone-1].fares , function(fareKey , fareValue){
			
			// check if fare is duplicate in the fare array
			var found = $.inArray(fareValue.type , faresArray);
			
			// add the fare types to the 'when are you riding' dropdown if it doesn't already exist in the found array 
			if (found < 0) {
				$('#whenRiding').append($('<option>', { value: fareValue.type , text: (fareValue.type).replace("_", " ") })); 
				faresArray.push(fareValue.type);
			}
		});
		
		// grab the current when value, and assign appropriate helper text from info json node 
		var currentWhen = $("#whenRiding").val();
		$(".helperText").text(globaljson.info[currentWhen]);
		
		
		// if the current when are you riding isn't empty
		if( currentWhen !== "" || currentWhen !== null  ) {
			
			// get the value of the selected checkbox for where will you purchase the fare
			var wherePurchase = $("input:radio[name='purchaseLocation']:checked").val();
			
			// get the value of the number spinner for how many rides will you need selection
			var howMany = $(".spinner").attr("aria-valuenow");
			
			// find in json the node object where the current zone, current when, and where you purchase values exists
			$.grep(globaljson.zones[currentZone-1].fares, function(obj) {
				if( obj.type === currentWhen && obj.purchase === wherePurchase) {
					
					// assign the found object's price to the global current price per ride variable
					currentPricePerRide =  obj.price;
				}
			});
			
			// print out the price value, based off the calculation of the price per ride times how many rides the person needs
			$(".farePrice").text( "$" + (currentPricePerRide * howMany).toFixed(2) );
		
		}
	}

}


// funciton populate cost on change
function populateCostOnChange() {
	
	// initialize current price per ride to zero, make sure whenready is empty
	var currentPricePerRide = 0;
	
	// grab the current 'where are you going' value
	var currentZone = $("#zoneName").val();
	
	// grabe the current when value, and assign appropriate helper text from info json node 
	var currentWhen = $("#whenRiding").val();
	$(".helperText").text(globaljson.info[currentWhen]);
	
	// if the currentwhen value is set to anytime, hide the "Onbaord" radio selection, this value isn't an option
	if(currentWhen == "anytime") {
		$("input:radio[id='station']").prop('checked', true);
		$(".onboardradio").hide();
	} else {
		
		// else make sure the onboard is showing
		$(".onboardradio").show();
	}
	
	// get the value of the selected checkbox for where will you purchase the fare
	var wherePurchase = $("input:radio[name='purchaseLocation']:checked").val();
	
	// get the value of the number spinner for how many rides will you need selection
	var howMany = $(".spinner").attr("aria-valuenow");
	
	// find in json the node object where the current zone, current when, and where you purchase values exists
	$.grep(globaljson.zones[currentZone-1].fares, function(obj) {
		if( obj.type === currentWhen && obj.purchase === wherePurchase) {
			
			// assign the found object's price to the global current price per ride variable
			currentPricePerRide =  obj.price;
		}
	});
					
	// print out the price value, based off the calculation of the price per ride times how many rides the person needs
	$(".farePrice").text( "$" + (currentPricePerRide * howMany).toFixed(2) );
}