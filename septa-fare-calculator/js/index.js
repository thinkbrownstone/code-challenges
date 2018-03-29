/**
 * JavaScript file required for SEPTA Fare Calculator.
 * Pre-requisites: jQuery v3.x
 * Author: Sandesh Naik
 * E-mail: sanaik@syr.edu 
 */

const faresURL = 'https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json';
let faresData;
const zoneSelect = $("[data-selector-name='zone-select']"),
timeSelect = $("[data-selector-name='time-select']"),
numTripsSelect = $("[data-selector-name='num-trips-select']"),
helpText = $("[data-selector-name='fares-help-text']"),
fareDisplay = $("[data-selector-name='total-fare']");

// runs when document loads
$(document).ready(function () {
    // first get fares from json.
    getFares();

    // attach 'onChange' eventListener to entire form.
    $('.fare-calculator-widget').on('change', function (event) {
        const userInput = parseForm();
        // update form display based on whether 'anytime' is selected.
        updateForm(userInput);

        // if input zone or time is invalid reset fare to show 0.
        if (isNaN(userInput.zone) || userInput.time === '') {
            resetFare();
        } else {
            calculateAndDisplayFare(userInput);
        }      
    });

});

// fetch json file which has zones/pricing data.
function getFares() {
    $.getJSON(faresURL, function (response) {
        faresData = response;

        // populate select list for zones and helper text display.
        populateForm();
    });
}

function populateForm() {
    populateZones(faresData.zones);
    populateHelperText(faresData.info);
}

// populate options for zone select dropdown.
function populateZones(zones) {
    for (var key in zones) {
        zoneSelect.append($('<option></option>')
            .attr('value', zones[key].zone)
            .text(zones[key].name));
    }
}

// populate text for helper text display.
function populateHelperText(info) {
    helpText.append(`<p><b>Weekday:</b> ${info.weekday}</p>
            <p><b>Evening/Weekend:</b> ${info.evening_weekend}</p>
            <p><b>Anytime:</b> ${info.anytime}</p>`);
}

// check selected purchase option
function getSelectedPurchaseOption() {
    if ($('#purchase-1').prop('checked'))
        return 'advance_purchase';
    
    if ($('#purchase-2').prop('checked'))
        return 'onboard_purchase';
}

// utility function to reset fare display to 0.
function resetFare() {
    fareDisplay.text('$0.00');
}

// calculate and display fare for selected(valid) inputs.
function calculateAndDisplayFare(userInput) {
    const selectedZone = faresData.zones.find(x => x.zone === userInput.zone);
    let totalFare;
    let fareTier;

    if (userInput.time === 'anytime') {
        fareTier = selectedZone.fares.find(x => x.type === 'anytime');
        totalFare = fareTier.price;
    } else {
        fareTier = selectedZone.fares.find(x => x.type === userInput.time && x.purchase === userInput.purchaseType);
        totalFare = fareTier.price * userInput.numTrips;
    }

    fareDisplay.text(`$${totalFare.toFixed(2)}`);
}

// parse all input controls for user input.
function parseForm() {
    let zone = parseInt(zoneSelect.val());
    let time = timeSelect.val();
    let purchaseType = getSelectedPurchaseOption();
    let numTrips = parseInt(numTripsSelect.val());

    const inputs = {
        zone,
        time,
        purchaseType,
        numTrips
    };

    return inputs;
}

// if 'anytime' is selected, set number of trips to 10 (cannot be changed by user) and disable 'onboard purchase' option.
// else enable trips input 'onboard purchase' option. 
function updateForm(userInput) {
    if (userInput.time === 'anytime') {
        numTripsSelect.val(10);
        numTripsSelect.prop('disabled', true);
        
        $('#purchase-1').prop('checked', true);
        $('#purchase-2').prop('disabled', true);
    } else {
        numTripsSelect.prop('disabled', false);
        $('#purchase-2').prop('disabled', false);
    }
}