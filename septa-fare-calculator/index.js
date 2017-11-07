// Workaround to get JSON data until a local web server is created
var faresData = JSON.parse(fares);

// Add array.find polyfill for older browsers
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        }
    });
}


// Get selected 'Zone' value
function getSelectZone() {
    var selectedZone = document.getElementById("zone-selector").value;
    return selectedZone;
}

// Get selected 'Time/When' value and display relevant informative message
function getSelectTime() {
    var selectedTime = document.getElementById("time-selector").value;
    var timeMessage = faresData.info[selectedTime];
    document.getElementById("timeMessage").innerHTML = "* " + timeMessage;
    return selectedTime;
}

// Get selected 'Ride Type/Location' value and display relevant informative message
function getSelectLocation() {
    var selectedLocation = document.querySelector('input[name=location]:checked').value;
    var locationMessage = faresData.info[selectedLocation];
    document.getElementById("locationMessage").innerHTML = "* " + locationMessage;
    return selectedLocation;
}

// Get "Ride Count/Quantity" input value
function getRideCount() {
    var rideCount = parseInt(document.querySelector('#ride-count').value);
    return rideCount;
}


// Get total value of fare selection
function getTotal() {

    // Narrow down our zone
    var selectedZone = getSelectZone();
    var filteredZone = faresData.zones[selectedZone];

    // Narrow down our fare type
    var filteredType = filteredZone.fares.filter(function(fareType) {
        var selectedTime = getSelectTime()
        if (fareType.type === selectedTime) {
            return fareType;
        }
    });

    // Narrow down purchase method
    var filteredPurchaseMethod = filteredType.find(function(availableType) {
        var selectedLocation = getSelectLocation();
        return availableType.purchase === selectedLocation;

        // if "purchase type" matches "selected type"
        if (availableType.purchase === selectedLocation) { 
            return true;
        }

    });

    var realPrice = filteredPurchaseMethod.price / filteredPurchaseMethod.trips;
    var quantity = getRideCount();
    var totalNum = quantity * realPrice // Calculate ride count with real price
    var totalPrice = totalNum.toFixed(2); // add 0 if number has 2 decimal places
    document.getElementById("total-price").innerHTML = '<h2 class="total">' + "Your fare will cost $" + totalPrice + "</h2>";
}