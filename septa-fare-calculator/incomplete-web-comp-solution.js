/**
 * NOTE: This is super incomplete and not my final solution. I'm including it just because I had fun
 * with it :). 
 */

(function() {

  const FAILURE_TEXT = `<p>We're sorry, it seems something went wrong. PLease try again later.`;
  const TEMPLATE = document.createElement('template');

	TEMPLATE.innerHTML = `
    <style>
      septa-fare-calculator { width: 400px; margin 50vh auto 0; background: lightgray; border: 1px solid gray; padding: 15px; }
      septa-fare-calculator .hidden { height: 1px; width: 1px; margin: -1px; }
      septa-fare-calculator h1 { color: red; }
      septa-fare-calculator select, septa-fare-calculator input, septa-fare-calculator label { width: 100%; }
    </style>
    <h1>Regional Rail Fares</h1>
    <form>
      <label for="zones">Where are you going?</label>
      <select id="zones"></select>

      <label for="type">When are you riding?</label>
      <select id="type">
        <option value="anytime">Anytime</option>
        <option value="weekday">Weekday</option>
        <option value="evening_weekend>Evening/Weekend</option>
      </select>

      <label for="vendor">Where will you purchase the fare?</label>
      <input type="radio" id="kiosk" name="vendor" value="Station Kiosk" />
      <input type="radio" id="onboard" name="vendor" value="Onboard" />
      
      <label for="trips">How many rides will you need?</label>
      <input type="text" id="trips" name="trips" placeholder="0"></select>
    </form>
    <p id="fare-total-placeholder">Your fare will cost: <span id="fare-cost"></span></p>
    <p id="fare-total">$0</p>
    <p class="live-region hidden" aria-hidden="true" aria-live="polite"></p>
	`;

	class SeptaFareCalculator extends HTMLElement {

		constructor() {
      super();
      // cache 'this' so we can use it later. 
      const _this = this;
			this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
      // grab refs to our form options
      this.tripsInput = this.shadowRoot.querySelector('#trips');
      //this.vendorInput = this.shadowRoot.querySelectorAll('[name]=vendor');
      //this.ticketTypeInput = this.shadowRoot.querySelector('#type');
      this.zonesInput = this.shadowRoot.querySelector('#zones');
      this.fareCostEle = this.shadowRoot.querySelector('#fare-cost');
      this.liveRegion = this.shadowRoot.querySelector('.live-region');
			this.getFareData().then((response) => {
				_this.fareResponseData = response;
				_this.populateZoneOptions();
			})
			.catch((error) => {
				_this.handleRequestFailure();
      })
      .finally(() => {
        _this.shadowRoot.removeChild(_this.shadowRoot.querySelector('#loader'));
      });
		}

		getFareData(callback) {
			return new Promise(function(resolve, reject) {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', 'fares.json');
				xhr.onreadystatechange = () => {
					if (xhr.readyState == 4) {
						if (xhr.status >= 200 && xhr.status < 300) {
							resolve(JSON.parse(xhr.responseText));
						}
						else {
							reject(Error(req.statusText));
						}
					}
				};
				xhr.onerror = () => {
					reject(Error("Something went extra wrong"));
				};
				xhr.send(null);
			});
		}

		connectedCallback() {
      this.addEventListener('change', this.handleFormUpdate);
		}

		disconnectedCallback() {
      this.removeEventListener('change', this.handleFormUpdate);
    }
    
    handleFormUpdate() {
      debugger;
    }

		populateZoneOptions() {
      debugger;
      const zones = this.fareResponseData.zones[0];
      let output = '';
      for (var i = 0; i < zones.length; i++) {
        let zone = zones[i].zone;
        output += `<option value="${zone}">Zone: ${zone}</option>`;
      }
      this.zonesInput.innerHTML = output;
		}

		handleRequestFailure() {
      this.shadowRoot.querySelector('form').innerHTML = FAILURE_TEXT;
		}

	}
	window.customElements.define('septa-fare-calculator', SeptaFareCalculator);
})();