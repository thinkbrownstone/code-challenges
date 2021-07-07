var $zone = $('#zone');
var $time = $('#time');
var $radio = $('#radio').find(":radio");
var $fareTotal = $('#fare-total');
var fare_data = null;
$.getJSON('fares.json', function(data) {
  fare_data = data;
  $zone.html('<option value="">Select a zone</option>');
  $time.html('<option value="">Zone must be selected first</option>');
  $radio.prop('checked', false); // uncheck all the boxes
  $fareTotal.html('');
  $.each(data.zones, function() {
    $zone.append($('<option>', {
      value: this.zone,
      text: this.name
    }));
  });
});

$zone.change(function() {
  var zone = this.value;
  $fareTotal.empty();
  $radio.prop('checked', false); // uncheck all the boxes
  if (zone == '') {
    $time.html('<option value="">Zone must be selected first</option>');
    return;
  }
  $time.html('<option value="">Select a time</option>');
  $.each(fare_data.zones, function() {
    if (this.zone == zone) {
      var fares_appended = {};
      $.each(this.fares, function() {
        if (!fares_appended[this.type]) {
          $time.append($('<option>', {
            value: this.type,
            text: fare_data.info[this.type]
          }));
          fares_appended[this.type] = true;
        }
        return false; // break the $.each loop
      });
    }
  });
});

function calc_price() {
  var zone = $zone.val();
  var type = $time.val();
  var purchase = $radio.find(":radio:checked").val();
  $fareTotal.empty();
  if (zone && time && purchase) {
    $.each(fare_data.zones, function() {
      if (this.zone == zone) {
        $.each(this.fares, function() {
          if (this.type == type && this.purchase = purchase) {
            $fareTotal.append($('<h2>', {
              text: '$' + this.price
            }));
            return false;
          }
        });
        return false;
      }
    });
  }
}

$time.change(calc_price);
$radio.change(calc_price);



