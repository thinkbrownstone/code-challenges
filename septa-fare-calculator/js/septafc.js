//global to hold JSON data
var JSON_FARES="";


//populate select options for zone, type options
$.fn.populateCalcCombo = function(val, name) { 
  var html = '';	
  for (var i =0; i < val.length; i++) {
    html += '<option value = "' + val[i] + '">'+ name[i] + '</option>';	
  }
  $(this).html(html);
};


// display help text for select type and radio purchase
$.fn.displayText = function(type) {
  if (type == 'anytime') {	
    $(this).html(JSON_FARES.info.anytime); 
  } else if (type == "weekday") {
    $(this).html(JSON_FARES.info.weekday);
  } else if (type == "evening_weekend") {
    $(this).html(JSON_FARES.info.evening_weekend);
  } else if (type == "advance_purchase") {
    $(this).html(JSON_FARES.info.advance_purchase);
  } else if (type == "onboard_purchase") {
    $(this).html(JSON_FARES.info.onboard_purchase);
} 
};	


//calculate fare based on zone, type, purchase, and qty
$.fn.calculateFare = function(zone, type, purchased, qty) {
  var septaFare = 0;
  var numRides = qty;
  var extraRides = 0;
  
  $.each(JSON_FARES.zones, function(index, value) {  		 
    if (zone == value.zone) {
       for (var i=0; i < value.fares.length;i++){	       
         if (type === value.fares[i].type &&
             purchased === value.fares[i].purchase) {
          septaFare = value.fares[i].price;
          // use price for every number of trips
          // if exceeds number of trips for price, then increase
          // numRides by 1
          numRides = parseInt(qty / value.fares[i].trips);
          extraRides = qty % value.fares[i].trips;
          if (extraRides > 0) {            	    
            numRides++;
          } 
          break;
         }
      }
    }  
  });
  $(this).html('$'+(septaFare*numRides).toFixed(2));
};


// recalc computed fare based on inputs
function fare_recalc() {
    var fzone = $('#sfzone').val();
    var ftype = $('#sftype').val();    
    var fpurchase = $('input[name=sfpurchase]:checked').val();
    var fqty = $('#fareqty').val();    
    
    $('#totalfare').calculateFare(fzone, ftype, fpurchase, fqty); 
}  


// get JSON via AJAX and store data in global variable JSON_FARES
// populate select options for zones and types from JSON
function load_JSON() {
  $.ajax({
            url: 'fares.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {	
              JSON_FARES = data;
              var fareZones =[];
              var fareNames = [];
              var fareType = [];              
              
              $.each(JSON_FARES.zones, function(index, value) {                		      
                  fareZones.push(value.zone);
                  fareNames.push(value.name);
                  for (var i=0; i < value.fares.length; i++) { 
                    if ($.inArray(value.fares[i].type, fareType) == -1) { 
                      fareType.push(value.fares[i].type);
                    }
                  }
              });     
             $('#sfzone').populateCalcCombo(fareZones, fareNames);
             $('#sftype').populateCalcCombo(fareType, fareType);
            }	   
  });
}


// ready 
$(document).ready(function () {
		
// read in JSON and populate select widgets		
  load_JSON();
  
// on change, display matching help text for selected type value
  $('#sftype').on('change', function () {     		  
    $('#type-helptext').displayText($(this).val());
   // anytime can only be an advance_purchase, so disable onboard 
   // and check advance_purchase
    if ($('#sftype').val() == "anytime") {
      $('#onboard_purchase').prop('disabled', true);
      $('#advance_purchase').prop('checked', true);
    } else {
      $('#onboard_purchase').prop('disabled', false);
    } 
  });  
  
// on change, display matching help text for selected purchase value
  $('#advance_purchase').on('change', function () {
    $('#purchase-helptext').displayText($(this).val());
  }); 
  $('#onboard_purchase').on('change', function () {     		  
    $('#purchase-helptext').displayText($(this).val());
  });  
 
});		


