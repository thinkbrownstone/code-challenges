'use strict'

const endpoint = 'fares.json';
let fareData;
fetch(endpoint)
	.then(response => response.json())
	.then(data => {
		fareData = data;
		normalize(data.zones);
		calcCost();
	});

const selects        = document.querySelectorAll('.fare-form-select');
const zoneSelect     = document.getElementById('zones');
const typeSelect     = document.getElementById('type');
const typeHelper     = document.querySelector('.fare-form-helper');
const purchaseRadios = document.querySelectorAll('.fare-form-radio');
const numRidesInput  = document.getElementById('num-rides');
const costText       = document.querySelector('.fare-cost-num');

// Normalize the Zone data to build the select options
function normalize(data) {
	const zones = data.map(item => {
		return {'label': item.name, 'value': item.zone};
	});
	buildSelect(zones, zoneSelect);
}

// Build the Zone select options
function buildSelect(info, el) {
	const options = info.map(item => {
		return `<option value=${item.value}>${item.label}</option>`;
	}).join('');

	el.innerHTML = options;
}

function populateHelper() {
	const value = this.options[this.selectedIndex].value;
	typeHelper.textContent = fareData.info[value];
}

function calcCost() {
	const selectedZone     = zoneSelect.options[zoneSelect.selectedIndex].value;
	const selectedType     = typeSelect.options[typeSelect.selectedIndex].value;
	const selectedPurchase = document.querySelector('input[name="purchase-type"]:checked').value;
	const zoneFares        = fareData.zones[selectedZone - 1].fares;
	const zoneFare         = zoneFares.find(fare => {
		return fare.type === 'anytime'
			? fare.type === 'anytime'
			: fare.type === selectedType && fare.purchase === selectedPurchase;
	})
	const numRides = numRidesInput.value;

	if (selectedType === 'anytime') {
		numRidesInput.disabled = true;
		let price = zoneFare.price;
		updatedCost(price.toFixed(2));
	} else {
		numRidesInput.disabled = false;
		let price = zoneFare.price * numRides;
		updatedCost(price.toFixed(2));
	}
}

function updatedCost(cost) {
	costText.textContent = `$${cost}`;
}

// Event Listeners
typeSelect.addEventListener('change', populateHelper);
selects.forEach(select => select.addEventListener('change', calcCost));
purchaseRadios.forEach(select => select.addEventListener('change', calcCost));
numRidesInput.addEventListener('change', calcCost);
