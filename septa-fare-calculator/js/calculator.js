//Create a single global variable
var FAREAPP = {};

$(document).ready(function() {
    populatezones();
});

function populatezones() {
	// Avoid .getJSON() ass requested in Think Brownstone Coding Standards
	var jqxhr = $.ajax({
    url: '../fares.json',
    type: "GET",
    cache: true,
    data: {},
    dataType: 'json',
    jsonp: 'callback'
  })
  .done(function(data) {
    // Store SEPTA fare info the global var
    FAREAPP.info = data.info;
    FAREAPP.zones = data.zones;
  });
}

// FIXME: The following contains repeated code. Should be refactored

// Update the fare helper text depending upon current options
$('[data-fare-time]').change(function(){
  var $HelperText = $('[data-fare-helper-text]').detach();
  var $AvailabilityText = $('[data-fare-availability-text]').detach();
  var $QuantityText = $('[data-fare-quantity-container] > p > label').detach();
  var defaultQuantityText = 'How many rides will you need?';
  var anytimeQuantityText = 'Anytime tickets sold in packs of 10.<br />How many 10 packs will you need?';
	var timeValue = $(this).val();
	var helperTextValue = FAREAPP.info[timeValue] + '.';
  var availabilityTextValue;

  // Update the time data-fare-purchase-location options
  if (timeValue === ''){

    $QuantityText.html(defaultQuantityText);
    $QuantityText.prependTo('[data-fare-quantity-container] > p');

    $('[data-fare-purchase-location]').prop('disabled', true);
    $('.radio-purchased-container > fieldset').addClass('disabled');
  }
  else if ( timeValue === 'anytime') {
    availabilityTextValue = '<strong>Note:</strong> Anytime tickets must be purchased at a SEPTA station kiosk.';

    $HelperText.html(helperTextValue);
    $HelperText.appendTo('[data-fare-time-container]');
    $AvailabilityText.html(availabilityTextValue);
    $AvailabilityText.appendTo('[data-fare-time-container]');
    $QuantityText.html(anytimeQuantityText);
    $QuantityText.prependTo('[data-fare-quantity-container] > p');

    $('[data-fare-purchase-location]').prop('disabled',true);
    $('.radio-purchased-container > fieldset').addClass('disabled');
  } else {
    availabilityTextValue = '<strong>Purchase Details:</strong> ' + FAREAPP.info.advance_purchase + ' ' + FAREAPP.info.onboard_purchase;

    $HelperText.html(helperTextValue);
    $HelperText.appendTo('[data-fare-time-container]');
    $QuantityText.html(defaultQuantityText);
    $QuantityText.prependTo('[data-fare-quantity-container] > p');

    $('[data-fare-purchase-location]').prop('disabled', false);
    $('.radio-purchased-container > fieldset').removeClass('disabled');
  }
});

// Calculate when field changes are detected
$('[data-fare-destination], [data-fare-time], [data-fare-purchase-location], [data-fare-quantity]').change(function(){

  var $fareCost = $('[data-fare-total-cost]').detach();
  var zone = $('[data-fare-destination]').val();
  var time = $('[data-fare-time]').val();
  var location = $('[data-fare-purchase-location]:checked').val();
  var quantity = $('[data-fare-quantity]').val();
  var cost;
  var totalCost;

  if (zone !== '' && time !== '' && location !== '' && quantity !== '') {
    $.each(FAREAPP.zones[zone-1].fares, function(index,object){
      if ((this.type === time ) && (this.purchase === location)){
        cost = this.price;
      }
    });

    totalCost = '$'+(cost*quantity).toFixed(2);

    $fareCost.html(totalCost);
    $fareCost.appendTo('[data-fare-total-cost-container]');
  } else {
    var totalCost = '$0.00';
    $fareCost.html(totalCost);
    $fareCost.appendTo('[data-fare-total-cost-container]');
  }
});
