/*1 Get the selected zone
  2 Add the event Listener on change that calls calculateFare function*/

/*1*/
var zoneSelect = document.querySelectorAll("#selectZone");
/*2*/
var selectedZone = "";
    for (let i = 0; i < zoneSelect.length; i++) {
        zoneSelect[i].addEventListener("change", function(){
            calculateFare();
        });
    }
/*1 Get the selected time frame when passenger is going to travel
  2 Add the event Listener on change that calls calculateFare function  */
/*1*/
var selectSpan = document.querySelectorAll("#selectSpan");
/*2*/
var selectedSpan = "";
    for (let i = 0; i < selectSpan.length; i++) {
        selectSpan[i].addEventListener("change", function(){
            calculateFare();
        });
    }
/*1 Get the selected place from where the passenger is going to purchase tickets
  2 Add the event Listener on change that calls calculateFare function  */
/*1*/
var purchase_place = document.querySelectorAll("#ticketPurchasePlace");
/*2*/
var ticketPurchasePlace = "";
    for (let i = 0; i < selectSpan.length; i++) {
        purchase_place[i].addEventListener("change", function(){
            calculateFare();
        });
    }
/*1 Get the selected number of rides 
  2 Add the event Listener on change that calls calculateFare function  */
/*1*/
var rideChange = document.getElementById("rideSelection"); 
/*2*/
 rideChange.addEventListener("change", function(){
    calculateFare();
 })

/*change selection function triggers when user selects "anytime" option, 
because "anytime" option is only applicable for 10 ride counts and station purchase
it changes the selection of user to appropriate selection if needed*/
var changeSelection = function(){
   var rideCount = 10;
   var anytimeSelectionInformation = "**Anytime Travel Passes are only available for 10 rides and can only be purchased at Stations"
   document.getElementById("station").checked = "true";
   document.getElementById("rideSelection").value = rideCount;
   document.getElementById("rideSelection").innerHTML = rideCount;
   document.getElementById("anytimeInformation").innerHTML= anytimeSelectionInformation;

}

/*displayInfo function displays the additional information about the current selection by the user*/
function displayInfo(getInfoAboutSpan, getInfoAboutPurchasePlace){
    document.getElementById("aboutSpan").innerHTML =  getInfoAboutSpan; 
    document.getElementById("aboutPlace").innerHTML = getInfoAboutPurchasePlace; 
}

/*  gets all the current selections by the user 
 *  on every change made to get up-to-date data
 *  called by outputFare() 
 *  returns an object of selected criteria
 */

var getCurrentSelection  = function(){
    var selectedZone = "";
    var selectedSpan = "";
    var ticket_purchase_place = "";
    var numberOfRidesSelected = "";

    var selectZone =  document.getElementById("selectZone"); 
    selectedZone = selectZone.value;

    var selectSpan = document.getElementById("selectSpan");
    selectedSpan = selectSpan.value;

    if(selectedSpan === "anytime"){
        ticket_purchase_place = "advance_purchase";
        numberOfRidesSelected = "10";
        changeSelection();
    }
    else{
        var purchase_place = document.querySelector('input[name = "ticket-purchase-place"]:checked');
        ticket_purchase_place = purchase_place.value;

        var numberOfRides = document.querySelector('input[name = "rideSelection"]'); 
        numberOfRidesSelected = numberOfRides.value;
        
        document.getElementById("anytimeInformation").innerHTML= "";
        }
    
    var selectionObject  = {
        "selectedZone" : selectedZone,
        "selectedSpan" : selectedSpan,
        "ticket_purchase_place" : ticket_purchase_place,
        "numberOfRidesSelected" :numberOfRidesSelected
    }
    return selectionObject;
}

/*  gets the data from the provided URL in the Form of JSON
 */

var getTheData = function(){
    var request; 
    if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } 
        else {
            //for IE
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
    var URL = "https://raw.githubusercontent.com/thinkbrownstone/code-challenges/master/septa-fare-calculator/fares.json";
    request.open("GET", URL,true);
    request.onreadystatechange = function(){
        if(request.readyState === 4 && request.status === 200){ //only use request.statues
             var returnedData = JSON.parse(request.responseText);
             outputFare(returnedData);
        }
       /*else{
            //server connection true but error in recving data
            console.log("server connection true but error in recving data");
        }*/
    };
    request.onerror = function(){
        //connection failed
        console.log("network error, connection failed and this is onerror func");
    }
    request.send();
}
	
/* called by getTheData function
 * calls getCurrentSelection()
 * responsible for calculating price,
 */
 function  outputFare(returnedData){
    var selectionObject  = getCurrentSelection(); 
    var getSelectedZone  = selectionObject["selectedZone"]
    var getSelectedSpan  = selectionObject["selectedSpan"]
    var getSelectedPlace = selectionObject["ticket_purchase_place"]
    var getSelectedRides = selectionObject["numberOfRidesSelected"]
    var getInfoAboutSpan; 
    var getInfoAboutPurchasePlace; 
    var suggestedPrice; 
    var calculatedPrice;

    for (var i = 0; i < returnedData["zones"].length; i++) {
        if(returnedData["zones"][i]["zone"] == getSelectedZone){
            for (var j = 0; j < returnedData["zones"][i]["fares"].length; j++) {
                if(returnedData["zones"][i]["fares"][j]["type"] == getSelectedSpan && returnedData["zones"][i]["fares"][j]["purchase"] == getSelectedPlace){
                    //calculated fare
                    calculatedPrice = returnedData["zones"][i]["fares"][j]["price"];
                    //suggested price to the user
                    suggestedPrice = returnedData["zones"][i]["fares"][4]["price"];
                }
            }
        }
    }   
    
    getInfoAboutSpan = returnedData["info"][getSelectedSpan]; 
    getInfoAboutPurchasePlace = returnedData["info"][getSelectedPlace]; 
    
    displayInfo(getInfoAboutSpan, getInfoAboutPurchasePlace);

    if(getSelectedRides !== 10 && getSelectedSpan !== "anytime"){
        calculatedPrice = calculatedPrice * getSelectedRides;
    }
    if(getSelectedRides > 5 && getSelectedSpan !== "anytime" ){
        document.getElementById("suggestion").innerHTML = "**Consider Taking Our Anytime 10 Ride Pass in Just $" + suggestedPrice; 
    }
    else{
        document.getElementById("suggestion").innerHTML = "";
    }
    document.getElementById("calculatedFare").innerHTML = calculatedPrice;
 }

//base function
var calculateFare = function(){
    getTheData(); 
}

window.onload = calculateFare();


