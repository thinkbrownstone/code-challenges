/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function(){
    var jsondata;
    $.getJSON("fares.json",function(result){
        jsondata = result; // Assigning result to Global Variable jsondata

        var dest_options = $("#zone");
        var ride_options = $("#ride_time");
        var count = 0;
        $.each(jsondata.zones, function(itemzone,value) {
            dest_options.append($("<option />").val(value.zone).text("Zone "+(value.zone)));
        });
        $.each(jsondata.info, function(iteminfo,value) {
            count++;
            if(count<4) {
                itemtext = iteminfo.replace("_"," ");
                ride_options.append($("<option />").val(iteminfo).text(itemtext));
            }
        });
        $("#helper_text").html(jsondata.info.anytime);
    });

    $("#ride_time").change(function() {
        ride = $(this).val();
        $.each(jsondata.info, function(iteminfo,itemvalue) {
            if(ride==iteminfo){
                $("#helper_text").html(itemvalue);
            }
        });
    });
    /* Calling calculate function on every change events */
    $("#zone").change(function(e){
        calculatefares();
    });
    $("#ride_time").change(function(e){
        calculatefares();
    });
    $('input[name=purchase_place]:checked', '#form_fare').on('click change', function(e) {
        calculatefares();
    });
    $("#rides").on('keyup blur', function(e){
        calculatefares();
    });
});

function calculatefares(){
    var jsondata;
    $.getJSON("fares.json",function(result){
        jsondata = result;
        var totalFare = 0;
        var type = $("#ride_time").val();
        var purchase = $('input[name=purchase_place]:checked', '#form_fare').val();
        var zone = $("#zone").val();
        var trips = $("#rides").val();
        /* Logic to calculate Fares */
        $.each(jsondata.zones, function(items,value) { 
            if(value.zone == zone) {
                var fares = value.fares;
                $.each(fares, function(attr,val) {
                    if(val.type==type && val.purchase==purchase) {
                        totalFare = ((trips * val.price) / val.trips);
                        $(".fares").html("$"+totalFare);
                    }
                });
            }
        }); 
    });
}