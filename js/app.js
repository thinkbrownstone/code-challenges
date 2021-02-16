var url = '/fares.json';
var data;


$(document).ready(function () {
    // Get data from json file and populate form
    getData();

    // Bind an event handler to the "change" event
    $('.container').change(function (e) {
        var userInput = getUserInput();
        if (userInput.zone !== '' && userInput.type !== '') {
            calculateTotal(userInput);
        }
    });

    // Insert additional info to helper box on "change" event
    $("#types").change(function (e) {
        $('.info').html(data.info[this.value]);
        if ($('#types').val() === 'anytime') {
            $('#num-rides').val(10).attr({
                "min": 10
            }).html('10');
            $('.info').append('. Min. 10 rides purchase required.');
        } else {
            $('#num-rides').val(1).attr({
                "min": 1
            }).html('1');
        }
    });
});

// Parse user input values
function getUserInput() {
    var zone = $('#zones').val();
    var type = $('#types').val();
    var purchaseType = $('input[name=purchase-location]:checked').val();
    var numTrips = parseInt($('#num-rides').val());

    var userInput = {
        zone,
        type,
        purchaseType,
        numTrips
    };
    return userInput;
}

// Calculate and display total
var anyTimeBasePrice;
function calculateTotal(userInput) {
    $.each(data.zones, function (i, item) {
        var fare;
        var totalPrice;
        if (item.zone == userInput.zone) {
            if (userInput.type === 'anytime') {
                fare = item.fares.find(x => x.type === 'anytime');
                anyTimeBasePrice = fare.price;
                totalPrice = anyTimeBasePrice + ((userInput.numTrips - 10) * (fare.price / 10));

            } else {
                fare = item.fares.find(x => x.type === userInput.type && x.purchase === userInput.purchaseType);
                totalPrice = fare.price * userInput.numTrips;
            }
            $('#fare-total').html(`$${totalPrice.toFixed(2)}`);
        }
    });
};

// Get data from json file and populate form
function getData() {
    $.getJSON(url, function (response) {
        data = response;
        populateForm(data.zones);
    });
}

// Populate form
function populateForm() {
    populateZones(data.zones);
}

// Populates select list for zones from json
function populateZones(zones) {
    $('#zones').append($('<option>').text("Select Zone").val(''));
    $.each(zones, function (i, item) {
        $('#zones').append($('<option>').text(item.name).attr('value', item.zone));
    });
}