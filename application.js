$(document).ready(function() {
  $.ajax({
    type: 'POST',
    dataType: 'JSON',
    url: 'fares.json',
    success: function(result) {
      // lets set the default values for the calculator for the user.
      var zone = result.zones[0].zone;
      var type = result.zones[0].fares[0].type;
      var purchase = result.zones[0].fares[0].purchase;
      var trips = 1;
      var price = result.zones[0].fares[0].price;
      // setting default helper info.
      var info = result.info[result.zones[0].fares[0].type];
      var purchaseInfo = result.info[result.zones[0].fares[0].purchase];

      // lets set the default helper text for the user to help them understand the option selected.
      $('#info').html(info);
      $('#info-purchase').html(purchaseInfo);

      // set the default price on page load.
      $('#fare').html(price.toLocaleString("us", {style: "currency", currency: "USD", minimumFractionDigits: 2}))

      $('#septa-form').on('change keyup', function(e) {

        var zoneId = $('#zone-select').val() - 1;

        var type = $('#type option:selected').val();
        var purchase = $('input[name=purchase]:checked').val();

        // find the helper text.
        var info = result.info[type];
        var purchaseInfo = result.info[purchase];

        // this is where we will find our pricing information.
        var pricingArray = result.zones[zoneId].fares.map(function(item) {

          fares = result.zones[zoneId].fares.filter(function (el) {
            return (el.type == type && el.purchase == purchase) || el.type == 'anytime'
          });

          // after filtering our array, lets grab the data for the user.
          var price = fares[0].price;
          var trips = fares[0].trips

          // filter anytime to display 10 tokens for specific price.
          if (type == 'anytime') {
            var farePrice = fares[0].price;
            $('#ride').val('10');
          } else {
            var farePrice = fares[0].price * $('#ride').val();
          }
          // display helper text for when are you riding info.
          $('#info').html(info);
          $('#info-purchase').html(purchaseInfo);

          // display the price to the user and format into USD currency.
          $('#fare').html(farePrice.toLocaleString("us", {style: "currency", currency: "USD", minimumFractionDigits: 2}))
        })
      })
    }
  })
})
