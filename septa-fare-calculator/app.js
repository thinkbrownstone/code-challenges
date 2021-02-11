/*global $*/
var SEARCH_URL = "./fares.json";


function getDataFromApi(zone, when, purchase, rides, callback) {
    $.ajax({
      url: SEARCH_URL,
      dataType: "json",
      success: function(data) {
            callback(data, zone, when, purchase, rides);
      }
});
}

function displayTotal(data, zone, when, purchase, rides) {
    var total;
    console.log(zone);
    var zoneData = data.zones[zone-1].fares;
    for (var i=0; i<zoneData.length; i++){
        if (zoneData[i].type==when&&zoneData[i].purchase==purchase){
            total=zoneData.price*rides;
        }
    }
    $(".fare-widget-total").html(total);
}

function watchFareWidget() {
 $(".fare-widget-form").submit(function(event) {
        event.preventDefault();
        var zoneTarget = $(event.currentTarget).find(".fare-widget-zone:selected");
        var zone = parseInt(zoneTarget.val());
        console.log(zone);
        var whenTarget = $(event.currentTarget).find(".fare-widget-when");
        var when = whenTarget.val();
        var purchaseTarget = $(event.currentTarget).find(".fare-widget-purchase");
        var purchase = purchaseTarget.val();
        var ridesTarget = $(event.currentTarget).find(".fare-widget-rides");
        var rides = ridesTarget.val();
        getDataFromApi(zone, when, purchase, rides, displayTotal);

   });

}

$(watchFareWidget);