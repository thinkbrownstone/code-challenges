// JavaScript Document
// Kevin Fry

$(document).ready(function() {
    var $selectedZone;
    var $selectedWhen;
    var $selectedWhere;
    var $howMany;
    var $scriptData = {};

    // 
    function ucWords(string) {
        return string.replace(/^([a-z])|\s+([a-z])/g, function($1) {
            return $1.toUpperCase();
        });
    }

    $.ajax({
        type: 'GET',
        "url": "fares.json",
        "dataType": "json",
        "success": function(data) {
            scriptData = data;
            howMany = $("#inputRides").val();
            console.log(scriptData);
            $.each(data, function(key, value) {
                if (key === "zones") {
                    $.each(value, function(zoneKey, zoneValue) {
                        // console.log(zoneValue.name);
                        var optText = document.createElement("option");
                        optText.innerHTML = zoneValue.name;

                        $("#selectZone").append(optText);

                        selectedZone = $("#selectZone option:selected").text();
                        //console.log(selectedZone);
                        checkAnytime();

                    });
                } else if (key === "info") {
                    $.each(value, function(infoKey, infoValue) {
                        var substring = "_purchase";
                        if (infoKey.endsWith(substring) === false) {
                            var optText = document.createElement("option");

                            var niceText = infoKey.replace("_", " ");
                            optText.innerHTML = ucWords(niceText);
                            optText.valueOf(infoKey);
                            $("#selectWhen").append(optText);
                            selectedWhen = $("#selectWhen option:selected").text();
                        }
                    });

                }
            }); // end each
        } // end success
    }); // end ajax

    function calculateTotal() {
        selectedWhere = $("input:checked").val();
        howMany = $("#inputRides").val();
        checkAnytime();
        console.log(selectedZone);
        console.log(selectedWhen);
        console.log(howMany);
        console.log(selectedWhere);
        $.each(scriptData, function(key, value) {
            if (key === "zones") {
                $.each(value, function(zoneKey, zoneValue) {
                    if (zoneValue.name === selectedZone) {
                        //var $i=0;
                        $.each(zoneValue.fares, function(fareObject, fareValue) {
                            var niceText = selectedWhen.replace(" ", "_");
                            var niceText2 = niceText.toLowerCase();
                            //console.log(fareObject.type + "" + fareObject.purchase);
                            //console.log(fareValue);
                            //console.log(fareValue.type); //nicetext2
                            //console.log(fareValue.purchase); //selectedWhere
                            if (howMany % 10 === 0) {
                                if ((fareValue.type === niceText2) && (fareValue.purchase === selectedWhere)) {
                                    //console.log("cost: " + fareValue.price);
                                    if (fareValue.type === "anytime") {
                                        var total = fareValue.price;
                                        $(".fareCost").text("$ " + total.toFixed(2));
                                    } else {
                                        var total = fareValue.price * howMany;
                                        $(".fareCost").text("$" + total.toFixed(2));
                                    }
                                }
                            } else {
                                if ((fareValue.type === niceText2) && (fareValue.purchase === selectedWhere)) {
                                    //console.log("cost: " + fareValue.price);
                                    var total = fareValue.price * howMany;
                                    $(".fareCost").text("$" + total.toFixed(2));
                                }

                            }
                        });
                    }
                });
            }
        }); // end each

    }

    function checkAnytime() {
        if (selectedWhen === "Anytime") {
            $("#inputRides").val("10");
            $("#onboard_purchase").hide();
            $("#label_onboard_purchase").hide();
        } else {
            $("#onboard_purchase").show();
            $("#label_onboard_purchase").show();

        }

    }

    $("#selectZone").change(function() {
        selectedZone = $("#selectZone option:selected").text();
        calculateTotal();
    });

    $("#selectWhen").change(function() {
        selectedWhen = $("#selectWhen option:selected").text();
        checkAnytime();
        var niceText = selectedWhen.replace(" ", "_");
        var niceText2 = niceText.toLowerCase();
        $.each(scriptData, function(key, value) {
            if (key === "info") {
                $.each(value, function(infoKey, infoValue) {
                    if (infoKey === niceText2) {
                        $("#whenHint").html(infoValue);
                    }
                });

            }
        }); // end each


        calculateTotal();
    });

    $("#advance_purchase").change(function() {
        selectedWhere = $("input:checked").val();
        calculateTotal();
    });

    $("#onboard_purchase").change(function() {
        selectedWhere = $("input:checked").val();
        calculateTotal();
    });

    $("#inputRides").change(function() {
        howMany = $("#inputRides").val();
        calculateTotal();
    });

    $("#inputRides").keyup(function() {
        howMany = $("#inputRides").val();
        calculateTotal();
    });

});