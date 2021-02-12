if (!Modernizr.svg) {
  $(".logo img").attr("src", "images/septa.png");
}

//get json
$.ajax({  url: "fares.json"}).done(function(data) {
	var zones = [];
	//get info text
	$.each(data.info, function(i, data) {
			$('[data-selector-name=help-text]').append(i+': '+data);
	});
	//populate destination dropdown
	$.each(data.zones, function(i, data) {
		$('[data-selector-name=fare-destination]').append('<option value="'+data.zone+'">'+data.name+'</option>');
	});


	//calculate inital total
	submitForm('form');

	//Borrowing the next few lines from stackoverflow
	// Define the element we wish to bind to.
	var bind_to = 'form';
	// Prevent double-binding.
	$(document.body).off('change', bind_to);
	// Bind the event to all body descendants matching the "bind_to" selector.
	$(document.body).on('change keyup', bind_to, function(event) {
		//form has changed. get values and call fareTotal function
		submitForm (bind_to);
	});

	function submitForm (form) {
		results = $(form).serializeArray();
		fareTotal(results[0].value,results[1].value,results[2].value,results[3].value);
	}

	//get ticket price and calculate total
	function fareTotal( myzone, mytype, mypurchase, myqty) {

		if(myqty=="") {
			//blank qty, do not calculate
			$('[data-selector-name=fare-total]').html("Enter the number of tickets");
			return false;
		}
		else if(!$.isNumeric(myqty)) {
			//qty not a number, get a little passive aggressive
			$('[data-selector-name=fare-total]').html("Enter the NUMBER of tickets");
			return false;
		}

		$.each(data.zones, function(i, zones) {
			if (zones.zone == myzone) {
				$.each(zones.fares, function(i, fares) {
					if(fares.type==mytype && fares.purchase == mypurchase) {
						//got it!
						$('[data-selector-name=fare-total]').html("<p>Your fare will cost<br><span>$" + (fares.price*myqty).toFixed(2) + "</span></p>");
						return false;
					}
				});
			}
		});
	}
});
