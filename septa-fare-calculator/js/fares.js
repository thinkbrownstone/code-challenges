$.ajax({
    url: '../fares.json',
    dataType: 'json',
    type: 'get',
    cache: false,
    success: (data) => {

        const zoneNum = $("#zonedrop");
        const rideWhen = $("#locdrop");
        const helper = $("#helper-text");
        const helper2 = $("#helper-text2");

        const ridesNeed = $("#ridesneeded");
        const howMany = $("#Field_howmany");
        const totalAmount = $("#total_amt");


         // First Dropdown by zone
        $(data.zones).each((index, item) => {
            zoneNum.append(
                $('<option value="'+item.zone+'">'+item.name+'</option>')
            );
        });
        // set to empty or default msg
        rideWhen.append(
            $('<option value="">'+ "Please Choose A Zone" +'</option>')
            
        );

        zoneNum.change(function() {
            // populate second dropdown based on zone option selected in first
            rideWhen.html('');
            howMany.html('');
            $("#fulltotal").html('');
            let time_zone1 = [];
            let price_zone1 = [];
            let time_zone2 = [];
            let price_zone2 = [];
            let time_zone3 = [];
            let price_zone3 = [];
            let time_zone4 = [];
            let price_zone4 = [];
            let time_zone5 = [];
            let price_zone5 = [];

            // Zone: CCP/1
            if (this.value == '1') {
                $(data.zones[0]).each((index, item, value) => {
                    for(let i = 0; i < data.zones.length; i++){
                        time_zone1 += '<option class="ride_time'+i+'" value ="'+item.fares[i].type+'">'+item.fares[i].type+'</option>';
                        price_zone1 += '<span class="price p'+i+'">'+item.fares[i].price+'</span>';
                    }
                    // Give ride time a value
                    rideWhen.append(
                        $('<optgroup label="Zone 1 Times">' + time_zone1 + '</optgroup>')
                    );
                    // Give a price
                    totalAmount.html(
                        $(price_zone1)
                    );
                });
            }
            // Zone: 2
            if (this.value == '2') {
                $(data.zones[1]).each((index, item, value) => {
                    for(let i = 0; i < data.zones.length; i++){
                        time_zone2 += '<option class="ride_time'+i+'" value="'+item.fares[i].type+'">'+item.fares[i].type+'</option>';
                        price_zone2 += '<span class="price p'+i+'">'+item.fares[i].price+'</span>';
                    }
                    rideWhen.append(
                        $('<optgroup label="Zone 2 Times">' + time_zone2 + '</optgroup>')
                    );
                    totalAmount.html(
                        $(price_zone2)
                    );
                });
            }
            // Zone: 3
            if (this.value == '3') {
                $(data.zones[2]).each((index, item, value) => {
                    for(let i = 0; i < data.zones.length; i++){
                        time_zone3 += '<option class="ride_time'+i+'" value="'+item.fares[i].type+'">'+item.fares[i].type+'</option>';
                        price_zone3 += '<span class="price p'+i+'">'+item.fares[i].price+'</span>';
                    }
                    rideWhen.append(
                        $('<optgroup label="Zone 3 Times">' + time_zone3 + '</optgroup>')
                    );
                    totalAmount.html(
                        $(price_zone3)
                    );
                });
            }
            // Zone: 4
            if (this.value == '4') {
                $(data.zones[3]).each((index, item, value) => {
                    for(let i = 0; i < data.zones.length; i++){
                        time_zone4 += '<option class="ride_time'+i+'" value="'+item.fares[i].type+'">'+item.fares[i].type+'</option>';
                        price_zone4 += '<span class="price p'+i+'">'+item.fares[i].price+'</span>';
                    }
                    rideWhen.append(
                        $('<optgroup label="Zone 4 Times">' + time_zone4 + '</optgroup>')
                    );
                    totalAmount.html(
                        $(price_zone4)
                    );
                });
            }
            // Zone: 5
            if (this.value == '5') {
                $(data.zones[4]).each((index, item, value) => {
                    for(let i = 0; i < data.zones.length; i++){
                        time_zone5 += '<option class="ride_time'+i+'" value="'+item.fares[i].type+'">'+item.fares[i].type+'</option>';
                        price_zone5 += '<span class="price p'+i+'">'+item.fares[i].price+'</span>';
                    }
                    rideWhen.append(
                        $('<optgroup label="Zone 5 Times">' + time_zone5 + '</optgroup>')
                    );
                    totalAmount.html(
                        $(price_zone5)
                    );
                });
            }

            //
            $.each(data.info, (index, key) => {
                helper.html(
                    $('<p class="'+key+'">' + data.info.weekday + '</p>')
                );
                $('input:radio[value=Station_advanced_purchase]').prop("checked",true);
                helper2.html(
                    $('<p>' + data.info.advance_purchase + '</p>')
                );
                ridesNeed.html(
                    $('<input id="Field_howmany" name="Field1" type="number" class="" min="0" value="0" size="3" tabindex="1" aria-label="Number of Rides">')
                );
            });

            // Try to sort out pricing this time around..

            let texttotal = document.querySelector("input#Field_howmany");
            let outputtotal = document.querySelector("#fulltotal");

            // listen and change the value when user inputs a number
            texttotal.addEventListener("input", () => {

                $('#total_amt span').each(function() {
                    // pull the price and multiply the dollar amount by ride number
                    const tot1 = (($('.p0').text()) * texttotal.value)
                    const tot2 = (($('.p1').text()) * texttotal.value)
                    const tot3 = (($('.p2').text()) * texttotal.value)
                    const tot4 = (($('.p3').text()) * texttotal.value)
                    const tot5 = (($('.p4').text()) * texttotal.value)
                    console.log(tot1, tot2, tot3, tot4, tot5); // These are the total prices !! :)
                    outputtotal.textContent = [ "$" + tot1 + ' ' + "$" + tot2 + ' ' + "$" + tot3 + ' ' + "$" + tot4 + ' ' +"$" + tot5]
                });

                // I can get the correct mathematicals, but there's clearly a S-M-R-Ter way to display everything
            });
            
        });

        rideWhen.change(function() {

            // We need some functionality to also display "info" message corresponding to purchase type
            const $option = $('option:selected', this);
            let stationAdv = $('input:radio[value=Station_advanced_purchase]');
            let onboardAdv = $('input:radio[value=Onboard_purchase]');

            if (this.value == 'weekday' && $option.hasClass('ride_time0')) {
                // weekday and advance
                $.each(data.info, (index, key) => {
                    helper.html(
                        $('<p class="'+key+'">'+data.info.weekday+'</p>')
                    );
                });
                stationAdv.prop("checked",true);
                helper2.html(
                    $('<p>' + data.info.advance_purchase + '</p>')
                );
            }
            else if (this.value == 'weekday' && $option.hasClass('ride_time1')) {
                // weekday and oboard
                $.each(data.info, (index, key) => {
                    helper.html(
                        $('<p class="'+key+'">'+data.info.weekday+'</p>')
                    );
                });
                onboardAdv.prop("checked",true);
                helper2.html(
                    $('<p>' + data.info.onboard_purchase + '</p>')
                );
            }
            else if (this.value == 'evening_weekend' && $option.hasClass('ride_time2')) {
                // eveningweekend and advance
                $.each(data.info, (index, key) => {
                    helper.html(
                        $('<p class="'+key+'">'+data.info.evening_weekend+'</p>')
                    );
                });
                stationAdv.prop("checked",true);
                helper2.html(
                    $('<p>' + data.info.advance_purchase + '</p>')
                );
            }
            else if (this.value == 'evening_weekend' && $option.hasClass('ride_time3')) {
                //eveningweekend and onboard
                $.each(data.info, (index, key) => {
                    helper.html(
                        $('<p class="'+key+'">'+data.info.evening_weekend+'</p>')
                    );
                });
                onboardAdv.prop("checked",true);
                helper2.html(
                    $('<p>' + data.info.onboard_purchase + '</p>')
                );
            }
            else if (this.value == 'anytime' && $option.hasClass('ride_time4')) {
                // anytime advance only
                $.each(data.info, (index, key) => {
                    helper.html(
                        $('<p class="'+key+'">'+data.info.anytime+'</p>')
                    );
                });
                stationAdv.prop("checked",true);
                helper2.html(
                    $('<p>' + data.info.advance_purchase + '</p>')
                );
            }
            else {
                stationAdv.prop("checked",true);
                helper2.html(
                    $('<p>' + data.info.advance_purchase + '</p>')
                );

            }


        });

    }

});

