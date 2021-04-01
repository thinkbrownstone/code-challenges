function septaCalculateFare(data) {
  var zoneNum = $('#destination').val();
  var whenRiding = $('#whenRiding').val();
  var whenRidingNote = data.info[whenRiding];
  var purchaseTime = $('input[type="radio"]:checked').val();

  // loop through data.zones array to find a data.zones.zone value that matches the 'Where are you going?' input value (zoneNum)
  for (i = 0; i < data.zones.length; i++) {
    if (data.zones[i].zone == zoneNum) {
      // loop through fares within matching zone for fare with currently selected "When are you riding?" input (whenRiding) AND "Where will you purchase the fare?" input (purchaseTime)
      for (j = 0; j < data.zones[i].fares.length; j++) {
        if (data.zones[i].fares[j].type == whenRiding && data.zones[i].fares[j].purchase == purchaseTime) {
          // calculate current fare by multiplying "How many tickets do you need?" input (ticketQuantity) by the fare's price
          var ticketQuantity = $('#ticketQuantity').val();
          var farePrice = Number.parseFloat(data.zones[i].fares[j].price * ticketQuantity).toFixed(2);
          // update price 
          $('.price').text('$' + farePrice);
        }
      }
    }
  }

  $('#whenRidingNote').text(whenRidingNote);
}

$('select, input, radio').on('change click focus blur', function () {
  $.ajax({
    url: 'includes/fares.json',
    context: document.body
  }).done(function (data) {
    septaCalculateFare(data);
  });
});

$(document).ready(function() {
  $('#destination').change();
});
