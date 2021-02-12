//---------------
// Variable Definition
//---------------
var septaData;
var whereGoing = "0";
var whenRiding = "anytime";
var wherePurchase = "advance_purchase";
var rides = 0;
var highTicketMessage;

//---------------
// Main Init Function
//---------------
initFareCalc();

function initFareCalc(){
    console.log('init fare calculator');
    //---------------
    // Get Fare Data
    //---------------
    // Full URL used to avoid cross-domain conflicts locally
    $.getJSON( "https://raw.githubusercontent.com/thinkbrownstone/code-challenges/master/septa-fare-calculator/fares.json", function( data ) {
        septaData = data;
        console.log(septaData);
        calculateFare();
    });

    //---------------
    // Add Event Listeners
    //---------------
    document.getElementById('where-going').addEventListener("change", calculateFare);
    document.getElementById('when-riding').addEventListener("change", calculateFare);
    document.getElementById('advance_purchase').addEventListener("change", calculateFare);
    document.getElementById('onboard_purchase').addEventListener("change", calculateFare);
    document.getElementById('rides').addEventListener("change", calculateFare);

}

//---------------
// Fare Calculation
//---------------
function calculateFare(){

    // Grabbing Form Data
    whereGoing = document.getElementById("where-going").value;
    console.log("where going - " + whereGoing);
    whenRiding = document.getElementById("when-riding").value;
    console.log("when riding - " + whenRiding);
    if(document.getElementById("advance_purchase").checked){
        wherePurchase = "advance_purchase";
    }else{
        wherePurchase = "onboard_purchase";
    }
    console.log("where purchased - " + wherePurchase);
    rides = document.getElementById("rides").value;
    console.log("how many rides - " + rides);


    //---------------
    // Fare Searching Loop
    //---------------
    window.setTimeout(function(){
        var fareZone = septaData.zones[parseInt(whereGoing)];
        var finalPrice;
        console.log(fareZone);
        for(var i = 0; i < fareZone.fares.length; i++){
            try{
                if(fareZone.fares[i].purchase == wherePurchase && fareZone.fares[i].type == whenRiding){
                    finalPrice = fareZone.fares[i].price;
                    if(parseInt(rides) >= 10){
                        highTicketMessage = " - we recommend checking out our 10+ ticket packages!";
                    }else{
                        highTicketMessage = "";
                    }
                    document.getElementById("finalFare").innerHTML = "$" + (finalPrice * parseInt(rides)).toFixed(2) + highTicketMessage;
                }
            }catch(e){
                console.log("no matching fare");
            }
        }
    }, 100)
}
