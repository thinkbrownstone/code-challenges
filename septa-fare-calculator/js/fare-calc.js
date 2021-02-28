$(document).ready(function(){
	var $inputs = $(":input"),
		$timeCombos = $("[data-section='time-combo']"),
		timeCombo = $timeCombos[0],
		$ridesSelectors = $("[data-section='rides']"),
		rideSelector = $ridesSelectors[0],
		$purchaseTypeRadios = $("[data-section='purchase-type']");
	
	// I am assuming that since we want live data, I should pull directly from your repo
	// I am also using $.getJSON in the interest of time, although I know that under normal circumstances $.ajax is prefered!
	$.getJSON("https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json", function( data ) {
		    timeCombo.addEventListener("change", function(e) {
				selectFareTime(e, data.info)
			});
			
			rideSelector.addEventListener("change", selectNumberOfRides);
			
			$.each($inputs, function(index, value) {
				value.addEventListener("change", function(e) {
					onInputChanged(e, data)
				});
			});
			
			$.each($purchaseTypeRadios, function(index, value) {
				value.addEventListener("change", selectPurchaseType);
			});
	});

	// prevent form submit/page refresh if we hit enter
	$(function() {
		$("form").submit(function() { return false; }
	);
});
});

// --- functions ---

// change helper text when selecting fare time and disable conflicting options
function selectFareTime(e, info) {
	var $timeHelpers = $("[data-section='time-helper']"),
		timeHelper = $timeHelpers[0],
		$purchaseTypeRadios = $("[data-section='purchase-type']"),
		$ridesSelectors = $("[data-section='rides']"),
		rideSelector = $ridesSelectors[0],
		$ridesHelpers = $("[data-section='rides-helper']"),
		ridesHelper = $ridesHelpers[0],
		newValue = e.target.value,
		helperText = info[newValue];
			
		// add extra qualifying information for anytime and change rideSelector to value of 10
		if (newValue === 'anytime') {
			helperText = helperText + ". Must be purchased in multiples of 10 tickets and cannot be purchased onboard."
			
			rideSelector.value = 10;
			ridesHelper.innerHTML = "Value must be a multiple of 10 for anytime rides.";
		} else {
			ridesHelper.innerHTML = "";
		}
		
		timeHelper.innerHTML = helperText;
		
		// don't allow users to select onboard purchase if anytime is selected		
		$.each($purchaseTypeRadios, function(index, value) {
			if (value.value === "onboard_purchase") {
				if (newValue === 'anytime') {
					value.disabled = true;
				} else {
					value.disabled = false;
				}
			}
		});
}

// if anytime is selected, prevent user from entering non-multiples of 10
function selectNumberOfRides(e) {
	var $timeCombos = $("[data-section='time-combo']"),
		timeCombo = $timeCombos[0],
		newValue = e.target.value;
		
		// warn about multiples of 10 for anytime rides
		if (timeCombo.value === 'anytime' && newValue%10 !== 0) {
			e.target.value = 10;
		} 
}

// don't allow users to select anytime ticket if onboard purchase is selected
function selectPurchaseType(e) {
	var $timeCombos = $("[data-section='time-combo']"),
		timeCombo = $timeCombos[0],
		options = timeCombo.options,
		anytimeOptionIndex = 0,
		radioValue = e.target.value,
		checked = e.target.checked;
		
		// getting this every time the event fires will take longer, but I have put this here for better readability and to keep code modular
		$.each(options, function(index, value) {
			if (value.value === 'anytime') {
				anytimeOptionIndex = index;
			}
		});
		
		if (radioValue === 'onboard_purchase' && checked) {
			timeCombo[anytimeOptionIndex].disabled = true;
		} else {
			timeCombo[anytimeOptionIndex].disabled = false;
		}
}

// any time a form input is changed, perform price calculation
function onInputChanged(e, data) {
	var $inputs = $("[data-section]"),
		finalPriceEls = $("[data-selector-name='price-display']"),
		finalPriceEl = finalPriceEls[0],
		zones = data.zones,
		fares,
		allInputsSet = true,
		selectedZone,
		selectedTime,
		selectedPurchaseType,
		selectedRides,
		calculatedPrice = 0,
		finalPrice = 0;
	
	// verify that a selection has been made for all inputs and set selection vars
	$.each($inputs, function(index, value) {
		var dataSection = value.dataset.section;
		
		switch (dataSection) {
			case "purchase-type":
				if (value.checked) {
					selectedPurchaseType = value.value;
				}
				break;
			case "location-combo":
				selectedZone = value.value;
				break;
			case "time-combo":
				selectedTime = value.value;
				break;
			case "rides":
				if (!value.value || value.value === "") {
					allInputsSet = false;
				} else {					
					selectedRides = value.value;
				}
				break;
		}		
	});
	
	// if some inputs are blank, don't do calculation
	if (!allInputsSet) {
		return;
	}
	
	// find the selected zone data
	$.each(zones, function (index, value) {
		if (value.name === selectedZone) {
			fares = value.fares;
			return;
		}
	});
	
	// get the price for matching remaining inputs
	$.each(fares, function (index, value) {
		if (value.type === selectedTime && value.purchase === selectedPurchaseType) {
			calculatedPrice = value.price;
		}
	});
	
	// make display as dollars (two decimals) and multiply by number of rides
	if (selectedTime === 'anytime') {
		finalPrice = parseFloat((calculatedPrice * selectedRides) / 10).toFixed(2);
	} else {
		finalPrice = parseFloat(calculatedPrice * selectedRides).toFixed(2);
	}
	
	// display final price
	finalPriceEl.innerHTML = "$" + finalPrice;
}

