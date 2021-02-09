import $ from "jquery";

$(function() {
    /**
     * Load JSON object
     * TODO: Address IE8 incompatability issues
     */
    var json = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'fares.json',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

    let zones = json.zones;
    let $zoneSelect = $('.septa-fare-widget__select--zone');
    let $timeSelect = $('.septa-fare-widget__select--time');
    let $numberInput = $('.septa-fare-widget__input__number');
    let $radioButtonActive = $('input:radio.septa-fare-widget__input__radio:checked');
    let $resultsElem = $('.septa-fare-widget__result');
    let $helptextElem = $('.septa-fare-widget__helptext');
    let $anytimeElem = $('.septa-fare-widget__anytime');

    /**
     * Calculate Total Amount
     */
    function calcTotal() {
        let zoneSelection = getZone();
        let timeSelection = getTimeValue();
        let purchaseSelection = getPurchaseInfo();
        let ticketNumber = getTicketNumber();
        let currentZone,
            currentFares,
            finalFare,
            finalTotal,
            anytimeFare;

        // Set variable with Current Zone JSON information
        zones.forEach(function(item) {
            if (item.zone == zoneSelection) {
                currentZone = item;
                return;
            }
        });

        // Get fares for currently selected zone
        currentFares = currentZone.fares;

        // Set Final Fare and discounted anytime fair for future use
        currentFares.forEach(function(item) {
            if (item.type == timeSelection && item.purchase == purchaseSelection) {
                finalFare = item;
            }

            if (item.type == 'anytime') {
                anytimeFare = item;
            }
        });

        finalTotal = finalFare.price * ticketNumber;

        // If the user enters 10 or more tickets, we announce that there 
        // is an opportunity for a discounted rate by buying anytime tickets
        if (ticketNumber >= 10 && finalFare.purchase == 'advance_purchase') {
            let anytimeTickets = Math.floor(ticketNumber/10);
            let anytimeRate = anytimeTickets * anytimeFare.price ;
            let standardTickets = ticketNumber % 10;
            let standardRate = standardTickets * finalFare.price;
            let finalDiscountedRate = anytimeRate + standardRate;

            if (finalDiscountedRate < finalTotal) {
                $resultsElem.text('$' + finalDiscountedRate.toFixed(2) + '*');
                $anytimeElem.text('*This is a discounted rate including ' + anytimeTickets + ' Anytime ticket(s) (which are valid anytime and are sold in bundles of 10). These tickets can only be bought at a station kiosk.');
            }
        } else {
            $resultsElem.text('$' + finalTotal.toFixed(2));
            $anytimeElem.text('');
        }
    }

    /**
     * Changes help text when travel time is changed by user.
     */
    function helptext() {
        let timeValue = getTimeValue();
        let info = json.info;

        if (timeValue == 'weekday') {
            $helptextElem.text(info.weekday);
        } else if (timeValue == 'evening_weekend') {
            $helptextElem.text(info.evening_weekend);
        }
    }

    /**
     * Getters
     */
    function getTicketNumber() {
        return $numberInput.val();
    }

    function getTimeValue() {
        return $timeSelect.val();
    }

    function getPurchaseInfo() {
        return $radioButtonActive.val();
    }

    function getZone() {
        return $zoneSelect.val();
    }
    
    /**
     * Populates select options for zones from JSON file.
     */
    zones.forEach(function(element) {
        let option = '<option value="' + element.zone + '">' + element.name + '</option>';
        $zoneSelect.append(option);
    });

    calcTotal();
    helptext();

    /**
     * On change of form elements, recalculate total number
     */
    $('.septa-fare-widget__form input, .septa-fare-widget__form select').change(function() {
        // update current radio button when form changes
        $radioButtonActive = $('input:radio.septa-fare-widget__input__radio:checked');
        calcTotal();
        helptext();
    });
});
