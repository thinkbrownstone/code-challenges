//Thanks StackOverflow: (https://stackoverflow.com/questions/14388452/how-do-i-load-a-json-object-from-a-file-with-ajax) 
function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

//Had to direct link this as I was getting a CORS policy error
fetchJSONFile('https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json', function(data){
    const faresInfo = data.info;
    const faresZones = data.zones;
    const whereTo = new Array;
    faresZones.forEach(function (element) {
        var option = '<option value="' + element.name.toLowerCase() + '">' + element.name + '</option>';
        whereTo.push(option);
    });
    $('#whatZone').append(whereTo);
    function calculate() {
        const zone = $('#whatZone').val();
        const when = $('#whatTime').val();
        const where = $('.radios input:checked').val();
        const number = $('#numberOfRides').val();
        var totalPrice = new Array;
        faresZones.forEach(function (element) {
            if (element.name.toLowerCase() == zone) {
                var fares = element.fares;
                fares.forEach(function (element) {
                    if (element.type.toLowerCase() == when && element.purchase.toLowerCase() == where) {
                        totalPrice.push(element.price * number); 
                    }
                });
            }
        });
        $('#wcFareTotal').empty();
        if (totalPrice == "" || totalPrice == 0) {
            $('#wcFareTotal').append('$0.00');
        } else {
            $('#wcFareTotal').append('$' + totalPrice);
        }
    }
    function helperText() {
        const whenHelp = $('#whatTime').val().toLowerCase();
        const whereHelp = $('.radios input:checked').val().toLowerCase();
        if (whenHelp == "anytime") {
            $('.what-time .helper-txt').remove();
            $('#whatTime').after('<small class="helper-txt">' + faresInfo.anytime + '</small>');
        }
        if (whenHelp == "weekday") {
            $('.what-time .helper-txt').remove();
            $('#whatTime').after('<small class="helper-txt">' + faresInfo.weekday + '</small>');
        }
        if (whenHelp == "evening_weekend") {
            $('.what-time .helper-txt').remove();
            $('#whatTime').after('<small class="helper-txt">' + faresInfo.evening_weekend + '</small>');
        }
        if (whereHelp == "advance_purchase") {
            $('.where-purchase .helper-txt').remove();
            $('.where-purchase .radios').after('<small class="helper-txt">' + faresInfo.advance_purchase + '</small>');
        }
        if (whereHelp == "onboard_purchase") {
            $('.where-purchase .helper-txt').remove();
            $('.where-purchase .radios').after('<small class="helper-txt">' + faresInfo.onboard_purchase + '</small>');
        }
    }
    calculate();
    helperText();
    var formElement = $('.widget-calculator select, .widget-calculator input');
    formElement.on('change', function() {
        calculate();
        helperText();
    });
});

