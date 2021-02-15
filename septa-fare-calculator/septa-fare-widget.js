var SeptaFareWidget = (function() {

  /**
   * Thanks for the opportunity and for a fun excercise!
   * Initially, I thought about doing this as a web component/custom HTMLElement. This is because
   * I completely missed the requirement about browser support, haha.
   * I've included that incomplete solution as well (incomplete-web-comp-solution.js)
   * since I spent time on it and had fun with it and figured, why not?
   * 
   * With more time, I'd add a loader that covers the widget during it's setup phase
   * and is removed when it's ready to be interacted with, and maybe add a public method
   * to 'reset' the form, etc, etc. 
   */

  var widgetInstance,
    fareData = {},
    rootEle = document.querySelector('.septa-fare-calculator'),
    calcFormEle = document.querySelector('#fare-options-form'),
    zoneOptionsEle = document.querySelector('#zones'),
    ticketTypeEle = document.querySelector('#type'),
    tripsEle = document.querySelector('#trips'),
    vendorButtons = document.querySelector('[name="vendor"]'),
    fareTotalEle = document.querySelector('#fare-total'),
    typeHelperTextEle = document.querySelector('#fare-type-helper-text'),
    liveRegionELe = document.querySelector('#live-region'),
    errorMessageText = 'We\'re sorry, but something went wrong. Please try again later.';

  /**
   * I wasn't 100% sure if every field needed to be populated dynamically, so
   * for now I'm only populating the 'zone' options.
   * If that assumption is wrong, and we do need to populate all fields on the fly,
   * we would simply change this to 'populateOptions()' and follow the exact same pattern.
   * 
   * @param data - the fare data payload to construct options from
   */
  function _populateZoneOptions(data) {
    var zones = data.zones;
    var output = '';
    for (var i = 0; i < zones.length; i++) {
      var zone = zones[i].zone;
      outputEle = document.createElement('option');
      outputEle.value = zone;
      outputEle.innerHTML = zone;
      zoneOptionsEle.appendChild(outputEle);
    }
  }

  /**
   * Request fare data from resource. In production, this
   * would point to a live endpoint.
   */
  function _getFareData() {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'fares.json');
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          }
          else {
            reject(Error(xhr.statusText));
          }
        }
      };
      xhr.onerror = () => {
        reject(Error('Something went extra wrong'));
      };
      xhr.send(null);
    });
  }

  /**
   * When the form is updated, grab the approrpiate values, 
   * calculate fare cost, and update the UI.
   * 
   * I'm making the assumption here that 'anytime' tickets can
   * only be purchased in packets of ten. If that's not the case, we
   * would simply do the math, based on the cost of ten, to figure out
   * the cost of the individual ticket.
   * 
   * @param event - the vanilla event object
   */
  function _onFormUpdate(event) {
    event.preventDefault();
    var vendorEle = document.querySelector('[name="vendor"]:checked'),
      zoneValue = parseInt(zoneOptionsEle.value),
      typeValue = ticketTypeEle.value,
      priceOfFare,
      tripsValue = tripsEle.value,
      vendorValue;

    // update helper text regardless of the following check
    typeHelperTextEle.innerHTML = fareData.info[typeValue];

    if (!typeValue || !zoneValue || !vendorEle || !tripsValue) {
      return;
    }
    
    var vendorValue = vendorEle.value;

    var fares = fareData.zones[zoneValue - 1].fares;
    var targetFare = fares.filter(function(fare){
      return fare.type === typeValue && fare.purchase === vendorValue;
    });

    if (typeValue === 'anytime') {
      tripsEle.value = tripsValue = '10';
      tripsEle.disabled = true;
      document.querySelector('#kiosk').checked = true;
      vendorButtons.disabled = true;
      priceOfFare = targetFare[0] ? targetFare[0].price : 0;
    } else {
      tripsEle.disabled = false;
      vendorButtons.disabled = false;
      priceOfFare = targetFare[0] ? (targetFare[0].price * tripsValue) : 0;

    }
    fareTotalEle.innerHTML = '$'+priceOfFare;
    // update live region to announce new fare
    liveRegionELe.innerHTML = 'Your fare will cost $'+priceOfFare;
  }

  /**
   * In the event of a failure to grab the fare data,
   * remove the form and replace with an error message.
   */
  function _handleRequestFailure() {
    var errorMessage = document.createElement('p');
    errorMessage.className = 'error';
    errorMessage.innerHTML = errorMessageText;
    rootEle.replaceChild(errorMessage, calcFormEle);
  }

  /**
   * Initialize the fare calculator, request fare data
   * and add necessary event handlers.
   */
  function init() {
    _getFareData().then((response) => {
      fareData = response;
      _populateZoneOptions(fareData);
      var defaultType = ticketTypeEle.querySelector('[selected]');
      typeHelperTextEle.innerHTML = fareData.info[defaultType.value];
    })
    .catch((error) => {
      _handleRequestFailure();
    });


    calcFormEle.addEventListener('change', _onFormUpdate);
    calcFormEle.addEventListener('input', _onFormUpdate);
    calcFormEle.addEventListener('submit', _onFormUpdate);

    // we may extend this later to add additional public stuff,
    // such as new functionality. For now there isn't much we need to return.
    return {
      getFareData: function() {
        return fareData;
      }
    }
  }

  return {
    getInstance: function () {
      if (!widgetInstance) {
        widgetInstance = init();
      }
      return widgetInstance;
    }
  }

})();
SeptaFareWidget.getInstance();