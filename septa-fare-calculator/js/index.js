(function () {
  
  /*** ASSUMPTIONS ***/
  
  // I see that the SEPTA website has some different pricing, but I will just use the data from the JSON
  
  // Assuming that the "anytime" time selection means we can only buy at a station kiosk in advance, and can only buy a 10-trip ticket (could set it up so anytime works with multiples of tens and just doubles the values, but only supposed to spend 60 mins on this)
  
  
  
  // Use strict mode cause we're cool like that
  "use strict";
  
  // Lets use vanilla JS because that's more "pure"
  var xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function () {
    
    // Since we are in strict mode, we need to put function declaration at the top level inside another function body
    var j;
    function calcTotal() {
      // Since its only a limited amount of zones, lets just loop thru and match on name
      for(i = 0; i < jsonResponse.zones.length; i++) {
        // For currently selected zone
        if(jsonResponse.zones[i].zone == destSelect.value) {
          // Go thru all the fares of this zone
          for(j = 0; j < jsonResponse.zones[i].fares.length; j++) {
            // If the time select is set to anytime, don't multiply to get value, just use num rides 10 and the anytime price value as the default (if I had more than 60 mins I could set it up so you could do multiples of 10s and just double the values)
            if(timeSelect.value == 'anytime' && jsonResponse.zones[i].fares[j].type == 'anytime') {
               document.getElementById('farecalc-total-cost').innerHTML = '<strong>$' + jsonResponse.zones[i].fares[j].price.toFixed(2) + '</strong>';
              return;
            } else if(timeSelect.value != 'anytime' && jsonResponse.zones[i].fares[j].type == timeSelect.value && jsonResponse.zones[i].fares[j].purchase == document.querySelector('input[name="farecalcPurchaseLocationRadios"]:checked').value) {
              // For currently selected time AND purchase location type
              document.getElementById('farecalc-total-cost').innerHTML = '<strong>$' + (jsonResponse.zones[i].fares[j].price * numRides.value).toFixed(2) + '</strong>';
              return;
            }
          }
        }
      }
    }
    
    // If request is done
    if(xhr.readyState === 4) {
      // If request responded with a success
      if(xhr.status === 200) {
        var jsonResponse = JSON.parse(xhr.responseText);
        
        // Loop over each zone to input possible destinations
        var i, destSelect = document.getElementById('farecalc-destination');
        for(i = 0; i < jsonResponse.zones.length; i++) {
          // Add each zone as a destination option
          destSelect.options[destSelect.options.length] = new Option(jsonResponse.zones[i].name, jsonResponse.zones[i].zone);
        }
        
        // Loop over the info to get times
        var timename, timeSelect = document.getElementById('farecalc-time');
        for(var key in jsonResponse.info) {
          // If it contains the word purchase, it is not a time value
          if(key.indexOf('purchase') === -1) {
            // If it has any underscores, replace them
            timename = key.replace('_', ' & ');
            
            // Add time as an option
            timeSelect.options[timeSelect.options.length] = new Option(timename.charAt(0).toUpperCase() + timename.slice(1), key);
          } else {
            // If it does contain purchase, its a purchase location value
            var divElem = document.createElement('div'), radioHTML;
            // See which of the known types it is
            if (key == 'advance_purchase'){
              radioHTML = '<input type="radio" name="farecalcPurchaseLocationRadios" id="farecalc-location-kiosk" value="' + key + '" checked="checked" /> <label for="farecalc-location-kiosk">Station Kiosk</label>';
            } else if (key == 'onboard_purchase') {
              radioHTML = '<input type="radio" name="farecalcPurchaseLocationRadios" id="farecalc-location-onboard" value="' + key + '" /> <label for="farecalc-location-onboard">Onboard</label>';
            } else {
              // If its some mysterious new purchase method, lets add it
              radioHTML = '<input type="radio" name="farecalcPurchaseLocationRadios" id="farecalc-location-' + key + '" value="' + key + '" /> <label for="farecalc-location-' + key + '">' + key + '</label>';
            }
            
            // Add radio html to new div
            divElem.innerHTML = radioHTML;
            // Add div
            document.getElementById('farecalc-purchase-location-fieldset').appendChild(divElem);
          }
        }        
        
        
        // Setup onchange event for destination select
        destSelect.onchange = function() {
          calcTotal();
        }
        
        // Setup onchange event for time select
        var timeHelperText = document.getElementById('farecalc-time-helper');
        timeSelect.onchange = function() {
          // If the time select is anytime, lets do some special stuff
          if(timeSelect.value == 'anytime') {
            // Add to helper text for further clarification
            timeHelperText.innerHTML = jsonResponse.info[timeSelect.value] + '. This includes weekdays, evenings, and weekends. Can only be bought at a station kiosk in advance and at a 10-trip rate.';
            
            // Lets automatically set the purchase location to a station kiosk as it seems the data says that's the only possible way
            document.getElementById('farecalc-location-kiosk').checked = true;
            // Disable all other radios for user clarity
            for(x = 0; x < radios.length; x++) {
              if(radios[x].id != 'farecalc-location-kiosk') {
                radios[x].disabled = true;
              }
            }
            
            // Lets also automatically set rides to 10 since data says that is what it should be as well (could set it up so anytime works with multiples of tens and just doubles the values, but only supposed to spend 60 mins on this)
            numRides.value = '10';
            // Disable field for clarity
            numRides.disabled = true;
          } else {
            timeHelperText.innerHTML = jsonResponse.info[timeSelect.value] + '.';
            
            // Re-enable all radios in case they were disabled for anytime juggling
            for(x = 0; x < radios.length; x++) {
              radios[x].disabled = false;
            }
            
            // Re-enable field in case they were disabled for anytime juggling
            numRides.disabled = false;
          }
          
          // Call calctotal function
          calcTotal();
        }
        
        // Setup onchange for purchase location
        var radios = document.farecalcForm.farecalcPurchaseLocationRadios, x, radioFunction = function() {
          // If the time select is set to anytime, lets make sure its stay at the advanced station kiosk radio (as per data spec)
          if(timeSelect.value == 'anytime') {
            document.getElementById('farecalc-location-kiosk').checked = true;
            // Disable all other radios for user clarity
            for(x = 0; x < radios.length; x++) {
              if(radios[x].id != 'farecalc-location-kiosk') {
                radios[x].disabled = true;
              }
            }
          } else {
            // Re-enable all radios in case they were disabled for anytime juggling
            for(x = 0; x < radios.length; x++) {
              radios[x].disabled = false;
            }
          }
          
          calcTotal()
        };
        for(x = 0; x < radios.length; x++) {
          radios[x].onclick = radioFunction;
        }
        
        // Setup onkeyup function for input text for numbner of rides. This way it will update when user is typing, not just on blur.
        var numRides = document.getElementById('farecalc-num-rides');
        numRides.onkeyup = function() {
          // If the time select is set to anytime, lets make sure we stay at 10 trip ticket (could set it up so anytime works with multiples of tens and just doubles the values, but only supposed to spend 60 mins on this)
          if(timeSelect.value == 'anytime') {
            numRides.value = '10';
            // Disable field for clarity
            numRides.disabled = true;
          } else {
            // Re-enable field in case they were disabled for anytime juggling
            numRides.disabled = false;
          }
          
          calcTotal();
        }
        
      } else {
        // Otherwise there was an error
        console.log('Error: ' + xhr.status);
      }
    }
  };
  
  xhr.open('GET', 'https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json');
  xhr.send();
  

})();