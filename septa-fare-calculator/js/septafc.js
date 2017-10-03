//global to hold JSON data
var JSON_FARES="";

//html for septra fare calculator widget
var fareWidgetHtml = function() {
	return '<div class="fare-header-container">'+
           '<h3>Regional Rails Fares</h3>'+
         '</div>'+ 
         
         '<form id="sfform">' +
         
         '<div class="fare-container">'+
           '<div id="farezone">'+
             '<fieldset>'+
               '<p>'+
                 '<label for="sfzone"><b>Where are you going?</b></label>'+
                 '<br><br>'+
                 '<select id="sfzone">'+
                 '</select>'+
               '</p>'+
             '</fieldset>'+
           '</div>'+
         '</div>'+         
         '<div class="fare-container">'+
           '<div id="faretype">'+
            '<fieldset>'+
               '<p>'+
                 '<label for="sftype"><b>When are you riding?</b></label>'+
                 '<br><br>'+
                 '<select id="sftype">'+
                 '</select>'+
               '</p>'+
             '</fieldset>'+
             '<div class="fare-helper-text" id="type-helptext"></div>'+
           '</div>'+
         '</div>'+
         
         '<div class="fare-radio-container" >'+
           '<div id="farepurchase">'+
            '<fieldset>'+
              '<legend><b>Where will you purchase the fare?<b></legend><br>'+
                '<p class="fare-radio-btn">'+
                  '<input type="radio" name="sfpurchase" id="advance_purchase" value="advance_purchase">'+
                  '<label for="kiosk">Station Kiosk</label>'+
                '</p>'+
                '<p class="fare-radio-btn">'+
                  '<input type="radio" name="sfpurchase" id="onboard_purchase" value="onboard_purchase">'+
                  '<label for="onboard">Onboard</label>'+
                '</p>'+
                '<div class="fare-helper-text" id="purchase-helptext"></div>'+
            '</fieldset>'+ 
           '</div>'+
         '</div>'+         
         '<div class="fare-container">'+
           '<fieldset>'+
             '<p><label for="fareqty"><b>How many rides will you need?</b></label><br><br>'+
             '<input type="number" id="fareqty" min=0 value=0></p>'+
           '</fieldset>'+
         '</div>'+
         
         '</form>' +
         '<div class="fare-footer-container">'+
            '<p><b>You fare will cost</b></p>'+           
            '<div class="fare-total" id="totalfare"><b>$0.00</b></div>'+
         '</div>';
}

//populate sfzone with names and zone values
var typeHtml = function() {
 var sftypeHtml = '';
 var types = ['weekday', 'evening_weekend', 'anytime'];
 for (var i=0; i < types.length; i++) {
   sftypeHtml += '<option value = "' + types[i] + '">'+ types[i] + '</option>';
  }  
  return sftypeHtml;  
}

//calculate fare based on zone, type, purchase, and qty
var calcFare = function(zone, type, purchased, qty) {
  var septaFare = 0;
  var numRides = qty;
  var extraRides = 0;
  
  if (zone < 1 || zone > 5) {
    alert("Invalid zone");
    return 0;
  }
    
  var value = JSON_FARES.zones[zone-1];
  
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
          return (septaFare*numRides);
     }
  }   
};

//populate sfzone with name and zone values 
var zoneHtml = function() {
 var sfzoneHtml = '';          
 
 $.each(JSON_FARES.zones, function(index, val) {
       sfzoneHtml += '<option value = "' + val.zone + '">'+ val.name + '</option>';
 });  
  return sfzoneHtml;  
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
              //populate sfzone with JSON names and zone values  
              $('#sfzone').html(zoneHtml());          
              
            }  
             
  });
}


//plugin septa fare calculator
$.fn.septaFareCalculator = function() {
//populate HTML	
  this.html(fareWidgetHtml);
  
// read in JSON and populate zones 		
  load_JSON();
  
//populate sftype with fare type values  
  $('#sftype').html(typeHtml);		
  $('#advance_purchase').prop('checked', true);

// on change, display matching help text for selected type value
  $('#sftype').change(function () {     		  
    //$('#type-helptext').displayText($(this).val());
    $('#type-helptext').html(JSON_FARES.info[$(this).val()]);
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
 $('#sfform input[type=radio]').change(function () {
    $('#purchase-helptext').html(JSON_FARES.info[$(this).val()]);
  });
 
 $('#sfform').change(function() {
 // recalc computed fare based on inputs
    var fzone = $('#sfzone').val();
    var ftype = $('#sftype').val();    
    var fpurchase = $('input[name=sfpurchase]:checked').val();
    var fqty = $('#fareqty').val();    
    
    $('#totalfare').html('$' + calcFare(fzone, ftype, fpurchase, fqty).toFixed(2)); 

  });  

   return this;
}		



// ready 
$(document).ready(function () {
//septa fare calculator		
  $('#septafc').septaFareCalculator();
  
});





         

