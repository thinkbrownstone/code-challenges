const url = './fares.json';
let fareData = [];  //to store json data
let zones = [];     //to store list of zones
let inputData = {}; // to store user entered data


// Detect if user is on IE browser
let isIE = !!window.MSInputMethodContext && !!document.documentMode;

if (isIE) {
   // Create Promise polyfill script tag
    let promiseScript = document.createElement("script");
    promiseScript.type = "text/javascript";
    promiseScript.src =
        "https://cdn.jsdelivr.net/npm/promise-polyfill@8.2.0/dist/polyfill.min.js";

  // Create Fetch polyfill script tag
    var fetchScript = document.createElement("script");
    fetchScript.type = "text/javascript";
    fetchScript.src =
        "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.5.0/dist/fetch.umd.min.js";

  // Add polyfills to head element
    document.head.appendChild(promiseScript);
    document.head.appendChild(fetchScript);

  // Wait for the polyfills to load and run the function. 
    setTimeout(function () {
        window
            .fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(res) { 
                return res.json() 
            })
            .then(handleResponse)
            .catch(handleErrors);
        }, 1000);
} 
else {
  // If fetch is supported, just run the fetch function
    fetch(url)
        .then(function(res) { 
            return res.json() 
        })
        .then(handleResponse)
        .catch(handleErrors);
}

function handleResponse(data) {
    fareData = data;
    fillZones(data.zones); //fill up zones
}

function handleErrors(err) {
    alert('Something went wrong: ' + err);    
}

function fillZones(zones) {
    const zone = document.getElementById('zone');
    zones.map(function(z) {
        const option = document.createElement("option");
        option.value = z.zone;
        option.innerHTML = z.name;
        zone.appendChild(option);
    })
}   

function calculateFare(e) {
    const cost = document.getElementById('cost');
    const costText = document.getElementById('cost-text');

    cost.innerHTML = "";
    costText.innerHTML = "";

    if (validInput(e) && receivedAllData()) {
        // if we have all the information, then filter the correct information from the json data
        let filteredData = getFilteredData();
        let zoneData = filteredData.zoneData;
        let result = filteredData.result;

        //get the cost element and display calculated price
        if (inputData.time !== 'anytime')
            cost.innerHTML = "$" + result[0].price * parseInt(inputData.rides);
        else   //if 10 rides are selected, show anytime price                
            cost.innerHTML = "$" + result[0].price;

        //also display price if an upgrade to anytime ticket will be cheaper 
        if (inputData.time !== 'anytime' && parseInt(inputData.rides) === 10) {
            let anytimeResult = zoneData.fares.filter(function(fare) { 
                                        return fare.type === "anytime"
                                })                        
            if (result[0].price * parseInt(inputData.rides) > anytimeResult[0].price) 
                costText.innerHTML = "Upgrade to Anytime ticket for a special price of $" + 
                                     anytimeResult[0].price + " for 10 tickets, purchased at the Kiosk";
        }
    }
}

function receivedAllData() {
    if (inputData.zone && inputData.time && inputData.location && inputData.rides)
        return true;
    else
        return false;
}

function getFilteredData() {
    let zoneData = fareData.zones.filter(function(z) { return z.zone === parseInt(inputData.zone)})[0];
    let result = zoneData.fares.filter(function(fare) {
                    return fare.type === inputData.time && fare.purchase === inputData.location
                 });
    return {"zoneData": zoneData, "result": result};
}

function validInput(e) {
    if (e.name === "time") {
        //display helper text if timings changed
        const helperText = document.getElementById('helper-text');
        helperText.innerHTML = e.value !== "" ? fareData.info[e.value] : "";

        const onboard = document.getElementById('onboard-purchase');
        const rides = document.getElementById('rides');
        const purchaseText = document.getElementById('purchase-text');

        //disable onboard purchase for anytime, 
        //and restrict trips to 10, these can also be done as multiples of 10 (but not implemented)
        if (e.value === "anytime") {
            //disable onboard option
            onboard.disabled = true;
            onboard.checked = false;
            if (inputData.location === "onboard-purchase")
                delete inputData.location;

            //make rides 10
            rides.disabled = true;
            rides.value = 10;
            inputData.rides = 10;
            purchaseText.innerHTML = "Anytime tickets can only be purchased at the kiosk"
        }
        else {
            onboard.disabled = false;
            rides.disabled = false;
            purchaseText.innerHTML = "";
        }
    }

    //if value removed from input delete from obj
    if (e.value === "") {
        delete inputData[e.name];
        return false;
    }

    //store input data in object        
    inputData[e.name] = e.value;
    return true;
}

function validateNumber(e) {
    //do not allow values < 1 or > 10 
    if (isNaN(parseInt(e.value)))
        e.value = "";
    if (e.value !== "" && e.value < 1)
        e.value = 1;
    if (e.value !== "" && e.value > 10)
        e.value = 10;   

    calculateFare(e);
}
