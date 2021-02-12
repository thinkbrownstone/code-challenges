(function() {
    // Get references to all the form elements
    var zoneDropdown = $('#srrfc-zone');
    var timeframeDropdown = $('#srrfc-timeframe');
    var timeframeText = $('#srrfc-timeframe-text');
    var purchase = 'advance_purchase';
    var purchaseRadios = jQuery("input[type='radio']");
    var rideCountButton = $('#srrfc-ride-count');
    var fareCostText = $('#srrfc-fare-cost');

    var fareInfo = null;

    function timeFrameDescription() {
      timeframeText.text(fareInfo.info[timeframeDropdown.val()]);
      calculateFare();
    }

    function purchaseType() {
      purchase = purchaseRadios.filter(":checked").val();
      calculateFare();
    }

    // Wrote this function when I made a bad assumption that the ride count input was a button.
    function addRide() {
      var rideCount = parseInt(rideCountButton.val());
      rideCountButton.val(rideCount + 1);
      calculateFare();
    }

    function getZone(zoneId) {
      zoneId = parseInt(zoneId);
      var zoneInfo = null;
      for(var i = 0; i < fareInfo.zones.length; i++) {
        zoneInfo = fareInfo.zones[i];
        if (zoneInfo.zone === zoneId) {
          break;
        }
      }
      return zoneInfo;
    }

    function getTicketCost(zoneInfo, type, purchase) {
      cost = 0;
      for(var i = 0; i < zoneInfo.fares.length; i++) {
        var fareInfo = zoneInfo.fares[i];
        if ((fareInfo.type === type) && (fareInfo.purchase === purchase)) {
          cost = fareInfo.price / fareInfo.trips;
          break;
        }
      }
      return cost;
    }

    function calculateFare() {
      var fare = 0;
      if (fareInfo) {
        if (timeframeDropdown.val() === 'anytime') {
          rideCountButton.val(10);
        }
        if (rideCountButton.val() < 1) {
          rideCountButton.val(1);
        }
        var zoneInfo = getZone(zoneDropdown.val());
        var ticketCost = getTicketCost(zoneInfo, timeframeDropdown.val(), purchase);
        fare = parseInt(rideCountButton.val()) * ticketCost;
      }
      fareCostText.text(fare.toFixed(2));
    }

    var jqxhr = $.ajax('./fares.json')
    .done(function(data) {
      fareInfo = data;
      calculateFare();
    })
    .fail(function() {
      alert('Can\'t load Fare Information');
    })

    zoneDropdown.change(calculateFare);
    timeframeDropdown.change(timeFrameDescription);
    purchaseRadios.click(purchaseType);
    rideCountButton.click(calculateFare);
})();
