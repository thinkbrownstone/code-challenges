//When DOM loaded
$(document).ready(function () {
  var json;
  //start ajax request
  $.ajax({
    url: "fares.json",
    //force to handle it as text
    dataType: "text",
    success: function (data) {

      //data downloaded so we call parseJSON function
      //and pass downloaded data
      json = $.parseJSON(data);
      //iterate through object keys
      $.each(json.zones, function (key, item) {
        //get the value of name
        var val = item
        var div_data = "<option value=" + item.zone + ">" + item.name + "</option>";
        $(div_data).appendTo('#where-are-you-going');
      });
      // Calculating on page load.
      calculate_total();
    }
  });

  // Calculating on form changes.
  $('#when-are-you-riding').on("change", function () {
    var type = $('#when-are-you-riding').val();

    calculate_total();
    if (type == 'anytime') {
      console.log(type);
      $("#onboard_purchase").attr('disabled', true);
      $("#advance_purchase").attr('checked', 'checked');
    }
    else {
      $("#onboard_purchase").attr('disabled', false);
    }
  });

  // Calculating on form changes.
  $('#where-are-you-going').on("change", function () {
    calculate_total();
  });

  // Calculating on form changes.
  $("#how-many-rides").on("change paste keyup", function () {
    calculate_total();
  });

  // Calculating on form changes.
  $('input[name="where-purchase"]').on("change", function () {
    calculate_total();
  });

  // Function to calculate fare charges.
  function calculate_total() {
    var going = $('#where-are-you-going').val();
    var riding = $('#when-are-you-riding').val();
    var rides = $('#how-many-rides').val();
    var where_purchase = $('input[name="where-purchase"]:checked').val();
    var trips = 0;
    var price = 0;
    var sum = 0;
    $.each(json.zones, function (key, item) {
      if (item.zone == going) {
        $.each(item.fares, function (key2, zone) {
          if (zone.type == riding && zone.purchase == where_purchase) {
            trips = zone.trips;
            price = zone.price;
            // If the trips are more, calculating it for single trip.
            if (zone.trips > 1) {
              price = price / trips;
            }
          }
        });
      }
    });
    sum = rides * price;
    sum = Number(sum).toFixed(2);
    $('#result-container .result-value').html('$' + sum);
  }
})