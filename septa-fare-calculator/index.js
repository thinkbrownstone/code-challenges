$(document).ready(function(){
  load();
});

function load() {
  var initVal = 0;

  var $getSepta = $.get( "fares.json" );

  var $initializeSepta = $getSepta.done( function(data) {
    $.each(data.zones, function (key, value) {
        $("[septaQ='destination']").append("<option>" + value.name + "</option");
    });

    // initialize selected option for #faresOne since options are added dynamically
    $("[septaQ='destination'] option:first-child").attr("select", true);

    // make initial value $0
    $("#fareCost").append("<p class='text-xlg'>$" + initVal + ".00</p>");
  }); // getFares.done()

  $initializeSepta.done( function(data) {
    // when there is a change in the form, get values of each input and map them to the JSON file to calculate price
    $("#fare select, #fare option, #fare input").change(function() {
      var septaDest = $("[septaQ='destination']").attr("value");
      var septaTime = $("[septaQ='time']").attr("value");
      var septaPurchaseLoc = $("input[type='radio'][name='where']:checked").attr("value");
      var septaTixAmount = $("[septaQ='tixAmount']").attr("value");

      // each time there is a change on the form, remove the price value <p> so the new val can be appended
      $("#fareCost").empty();
      
      // get the price based on criteria
      $.each(data.zones, function (key, value) {
        if( septaDest === value.name ) {
          $.each(value.fares, function (k, v) {
            if ( septaTime === v.type ) {
              if ( septaPurchaseLoc === v.purchase ) {
                initVal = v.price;
                if ( septaTixAmount == "" ) {
                  $(".septa-fieldset:has([septaQ='tixAmount']) p").empty();
                  $("#fareCost").append("<p class='text-xlg'>$" + initVal + "</p>");
                  $("#fareCost").append("<p class='text-sm'>This price is for one ticket</p>");
                } else if ( $.isNumeric(septaTixAmount) === false ) {
                  $(".septa-fieldset:has([septaQ='tixAmount']) p").empty();
                  $(".septa-fieldset:has([septaQ='tixAmount'])").append("<p class='text-sm'>Please only enter numerals, i.e. '2' for two tickets</p>");
                  $("#fareCost").append("<p class='text-xlg'>$0.00</p>");                    
                } else {
                  $(".septa-fieldset:has([septaQ='tixAmount']) p").empty();
                  $("#fareCost").append("<p class='text-xlg'>$" + (initVal * septaTixAmount) + "</p>");
                }

              }
            }
          }); // looking at values in 'fares' objects
        }
      });
    });
  }); // $intializeSepta.done
}
