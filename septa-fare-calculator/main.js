"use strict";

//var for dataset
var jsonData = null;

//object containing form els 
var formEls = {
    zones: document.querySelector('#zones'),
    dayOfWeek: document.querySelector('#dayOfWeek'),
    dayOfWeekDescription: document.querySelector('#dayOfWeekDescription'),
    purchaseLocation: document.querySelector('#purchaseLocation'),
    quantity: document.querySelector('#quantity'),
    totalCost: document.querySelector('#totalCost')
}

//this is an empty object where the values the user selects will be kept
let selectedValues = {};

//if we didn't have to support IE8, we could use fetch
function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                jsonData = data;
                if (callback) callback(data);
            } 
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

/* 
* summary               requests the file and executes a callback with the parsed result once it is available
* @param    {string}    URL to be parsed
* @param    {function}  callback function    
*/
fetchJSONFile('https://raw.githubusercontent.com/cahdeemer/code-challenges/master/septa-fare-calculator/fares.json', function(data){
    console.log(jsonData);
    populateForm(jsonData);
});

/* 
* summary               populates the form with the current data
* notes                 commented lines show examples of ES6 syntax (not compatible with IE)
* @param    {object}    data to be passed  
*/
let populateForm = function(data) {
    var zones = data.zones;
    var info = Object.keys(data.info);
    formEls.zones.innerHTML = zones.map(function(zones) {return '<option value="' + zones.zone + '">'+ formatText(zones.name) +'</option>'; }).join('');
    formEls.dayOfWeek.innerHTML = info.map(function(detail) { if(info.indexOf(detail) < 3) { return '<option value="' + detail + '">' + formatText(detail) + '</option>'}}).join('');
    formEls.purchaseLocation.innerHTML = info.map(function(detail) { if (info.indexOf(detail) > 2) { return '<div><input type="radio" onChange="updateState()" name="locations" id="' + detail + '" value="' + detail + '"><label for=' + detail + 'class="radio-label">' + formatText(detail) + '</label></div>'}}).join('');;
    //formEls.purchaseLocation.innerHTML = info.map(item => (info.indexOf(item) > 2) ? `<div><input type="radio" onChange="updateState()" name="locations" id="${item}" value="${item}"><label for=${item} class="radio-label">${formatText(item)}</label></div>` : '').join('');;
    setInitialState(data);
}

/* 
* summary   sets the initial state for the relevant form items
*/
let setInitialState = function(data) {
    formEls.purchaseLocation.firstChild.firstChild.checked = true;
    formEls.dayOfWeek.getElementsByTagName('option')[1].selected = true;
    formEls.dayOfWeekDescription.innerHTML = '<span class="helper">' + Object.values(data.info)[1] + '</span>';
    formEls.quantity.value = 0;
}

/*
* summary               this helper function ensures a number is formatted appropriately for US currency
* @param    {number}    the number to be converted to two places
* @return               returns a number that is fixed to two places 
*/
let formatPrice = function(value) {
    return value.toFixed(2);
}

/*
* summary               this helper function replaces underscores in a string with a blank space
* @param    {string}    the string to be sanitized of underscores
* @return               returns a srring without underscores 
*/
let formatText = function(string) {
    return string.replace(/_/g, " ");
}

/*
* summary   updates the contents of the DayofWeek Description element to match the value of the DayofWeek option
*/
let updateDayOfWeekDescription = function() {
    formEls.dayOfWeekDescription.innerHTML = '<span class="helper">' + Object.values(jsonData.info)[formEls.dayOfWeek.selectedIndex] + '</span>';
}

/*
* summary               this function deterines whether onboard purchase is available
* @param    {string}    the time is a string, it is the day of the week 
* @param    {number}    the quantity is an integer
* @return               boolean 
*/
let isOnBoardPurchaseDisabled = function(time, quantity) {
    if (time === 'anytime' || quantity === 10) {
        return true
    } else {
        return false
    }
}

/*
* summary               this function enables or disables the radio button for onboard purchases
* @param    {string}    the time is a string, it is the day of the week 
* @param    {number}    the quantity is an integer
*/
let toggleOnBoardPurchase = function(time, quantity) {
    document.getElementById('onboard_purchase').disabled = isOnBoardPurchaseDisabled(time, quantity);
}

/*
* summary               checks to see if the Day of Week chosen is anytime
* @param    {string}    the time is a string, it is the day of the week 
* @return   {boolean}   is the 
*/
let isAnytime = function(time) {
    if (time === 'anytime') {
        return true
    } else {
        return false
    }
}


/*
* summary               updates the quantity to 10 if the Day of Week selected is 'anytime'
* @param    {string}    the time is a string, it is the day of the week 
* @return   {boolean}   is the 
*/
let updateQuantityCheck = function(time) {
    if (isAnytime(time)) {
        formEls.quantity.value = 10;
    } else {
       //do nothing
    }
}

/*
* summary               finds the toal price
* ES6 version           const calcTotal = theQuantity % 10 != 0 ? basePrice * theQuantity : basePrice;   
* @param    {number}    the quantity is an integer, the number tickets
* @param    {number}    the price may have floats, the base price
* @return   {number}    returns the price
*/
let calcTotal = function(quantity, price) {
    if (quantity === 10) {
        return price;
    } else {
        return price * quantity;
    }
}

/*
* summary               displays the total price
* @param    {number}    the quantity is an integer, the number tickets
* @param    {number}    the price may have floats, the base price
*/
let displayPrice = function(quantity, price) {
    formEls.totalCost.innerHTML = '<span>$' + formatPrice(calcTotal(quantity, price)) + '</span>'; 
}


/* 
* summary   gets the values of the items in the form and calculates the total price based on those values
*/
let updateState = function() {
    //getting the values from the form and pushing them to the object
    selectedValues.zone = formEls.zones.options[formEls.zones.selectedIndex].value;
    selectedValues.time = formEls.dayOfWeek.options[formEls.dayOfWeek.selectedIndex].value;
    selectedValues.quantity = formEls.quantity.value;
    selectedValues.location = document.querySelectorAll('input[type="radio"]:checked');
    selectedValues.locationValue = function() { return this.location[0].value};


    //set the time description
    updateDayOfWeekDescription();

    //enables or disables onboard purchases
    toggleOnBoardPurchase(selectedValues.time, selectedValues.quantity);

    //updates the quantity if the time selected is 'anytime'
    updateQuantityCheck(selectedValues.time);


    //filter down the data, a step at a time, until we get to the right base price
    const filterByZone = jsonData.zones.filter(function(hero) {
        return hero.zone == selectedValues.zone;
    });

    const filterByTime = filterByZone[0].fares.filter(function(hero) {
        return hero.type == selectedValues.time;
    });
    const filterByLocation = filterByTime.filter(function(hero) {
        return hero.purchase == selectedValues.locationValue();
    })
    const basePrice = filterByLocation[0].price;
  
    //and stick that in the HTML
    displayPrice(selectedValues.quantity, basePrice);

}


//Event listeners that update state on change
formEls.zones.addEventListener('change', updateState)
formEls.dayOfWeek.addEventListener('change', updateState);
formEls.quantity.addEventListener('change', updateState);
