'use strict'

const zone = document.getElementById("zone_options");
const fareType = document.getElementById("fare_types");
const purchaseTypes = [
  document.getElementById("purchase_location_type_1"),
  document.getElementById("purchase_location_type_2")
];
const tripCount = document.getElementById("trips");
const displayedFare = document.getElementById("calculated_fare_output");
const displayedMessage = document.getElementById("message");
let septaData;

// FETCH/REQUEST SEPTA FARE DATA
const fetchData = (filepath, callback) => {
  let request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      let data = JSON.parse(request.responseText);
      callback && callback(data);
    }
  };
  request.open("GET", filepath, true);
  request.send();
}

fetchData("fares.json", data => {
  septaData = data;
  populateForm(data);
});

const updateDisplayedFare = (price, type) => {
  const message = 'Anytime tickets can only be purchased in advance at a Station ' +
                  'Kiosk and are valid for ten trips.'

  if (type === 'anytime') {
    tripCount.value = 10;
    tripCount.disabled = true;
    purchaseTypes[1].disabled = true;
    purchaseTypes[0].checked;
    displayedFare.innerHTML = `$${price}`;
    displayedMessage.style.display = 'block';
    displayedMessage.innerHTML = message;
  } else {
    displayedFare.innerHTML = `$${price}`;
  }
}

// TODO: Refactor below function so that DOM elements are updated separately

const calculateFare = (options) => {
  tripCount.disabled = false;
  purchaseTypes[1].disabled = false;
  displayedMessage.style.display = 'none';

  const { selectedZone, selectedFareType, selectedPurchaseType, selectedTripCount } = options;
  const { zones } = septaData;
  const filteredZone = zones.filter(zone => zone["zone"] === selectedZone);
  const [ fares ] = filteredZone;
  const filteredFare = fares && fares.fares.filter(fare =>
  fare["type"] === selectedFareType &&
  fare["purchase"] === selectedPurchaseType
  );

  let updatedPrice;
  let price = filteredFare.length ? filteredFare[0].price : 0.00;
  let type = filteredFare.length ? filteredFare[0].type : '';

  // TODO: Address any bugs / edge cases regarding selection of 'anytime' option

  if (type === 'anytime') {
    updatedPrice = price.toFixed(2);
  } else {
    updatedPrice = (price * selectedTripCount).toFixed(2);
  }

  updateDisplayedFare(updatedPrice, type);
}

const addZoneOptions = (zones) => {
  let parent = document.getElementById("zone_options");

  for (let i = 0; i < zones.length; i++) {
    let zoneOption = document.createElement("option");
    zoneOption.value = i + 1;
    zoneOption.innerHTML = zones[i].name;
    parent.appendChild(zoneOption);
  }
}

const addFareTypeOptions = (fareTypes) => {
  let parent = document.getElementById("fare_types");
  const { anytime, weekday, evening_weekend } = fareTypes;
  const label = "Evening OR Weekend";

  for (let type in fareTypes) {
    let fareTypeOption = document.createElement("option");
    fareTypeOption.value = type
    type === "evening_weekend" ? fareTypeOption.innerHTML = "Evening OR Weekend"
    : fareTypeOption.innerHTML = type.charAt(0).toUpperCase() + type.substr(1);
    parent.appendChild(fareTypeOption);
  }
}

const addHelperInfo = (fareTypes) => {
  let parent = document.getElementById("fare_types_helper_text");
  const { anytime, weekday, evening_weekend } = fareTypes;

  let helperText = document.createElement("div");
  helperText.innerHTML = `
    <p><strong>Anytime:</strong> ${anytime}</p>
    <p><strong>Weekday:</strong> ${weekday}</p>
    <p><strong>Evening OR Weekend:</strong> ${evening_weekend}</p>
  `
  parent.appendChild(helperText);
}

const onChange = () => {
  let userInput = getUserInput();
  calculateFare(userInput);
}

const getSelectedZone = () => parseInt(zone.options[zone.selectedIndex].value);

const getSelectedFareType = () => fareType.options[fareType.selectedIndex].value;

const getSelectedPurchaseType = () => {
  for (let i = 0; i < purchaseTypes.length; i++) {
    if (purchaseTypes[i].checked) {
      return purchaseTypes[i].value;
    }
  }
}

// TODO: Add input validation

const getSelectedTripCount = () => parseInt(tripCount.value) || 1

const getUserInput = () => {
  let selectedZone = getSelectedZone();
  let selectedFareType = getSelectedFareType();
  let selectedPurchaseType = getSelectedPurchaseType();
  let selectedTripCount = getSelectedTripCount();

  const userInput = { selectedZone, selectedFareType, selectedPurchaseType, selectedTripCount };

  return userInput;
}

// ATTACH EVENT LISTENERS
const addEventListeners = () => {
  zone && zone.addEventListener("change", onChange, false);
  fareType && fareType.addEventListener("change", onChange, false);
  tripCount && ["input", "change"].map(listener => {
    tripCount.addEventListener(listener, onChange, false);
  })

  if (purchaseTypes) {
    for (let i = 0; i < purchaseTypes.length; i++) {
      purchaseTypes[i].addEventListener("change", onChange, false);
    }
  }
}

// DYNAMICALLY POPULATE THE UI
const populateForm = (septaData) => {
  const { info, zones } = septaData;
  const { anytime, weekday, evening_weekend } = info
  const fareTypes = { anytime, weekday, evening_weekend }

  addZoneOptions(zones);
  addHelperInfo(fareTypes);
  addFareTypeOptions(fareTypes);
  addEventListeners();
}
