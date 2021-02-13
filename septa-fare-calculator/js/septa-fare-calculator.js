$(document).ready(function () {
  if ($('.septa-calculator').length) {

    
    $("#calculate-septa-form").on('submit', function (e) {
      e.preventDefault();
      calculateFare();
    });
    
  }
});

function calculateFare() {
  var zone = $('#septa-calculator-zone-select').val();
  var time = $('#septa-calculator-time').val();
  var purchaseType = $('input[name=purchase-method]').val();
  var numberOfRides = $('#number-of-rides').val();
  
  $.ajax({
    url: 'fares.json',
    type: 'get',
    dataType: 'json',
    success: function(data){
      var zones = data['zones'];
      var specifiedZone = data['zones'][zone];
      for (var eachZone in specifiedZone) {
        // find correct data for each user object.
      }
    }
  });

}