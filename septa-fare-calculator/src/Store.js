let instance = null;

/**
 * Simple store that retrieves data and manages state
 */

class Store {

    constructor () {
        // we want a singleton, so check if store already exists
        if (instance) {
            return instance;
        }

        // data from API
        this._data = {};

        this._count = 1;
        this._location = "advance_purchase";
        this._time = "weekday";
        this._zone = 1;

        // bind this to setters
        this.setCount = this.setCount.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.setTime = this.setTime.bind(this);
        this.setZone = this.setZone.bind(this);

        // function to call when store changes,
        // set by subscribe()
        this._notifyCallback = () => {};

        // set the singleton instance
        instance = this;

        return this;
    }

    // fetch data from the URL
    fetchData () {
        fetch("/fares.json")
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this._data = json;
                // notify subscribers of update
                this.notify();
            });
    }

    // execute callback from subscriber
    notify () {
        this._notifyCallback();
    }

    // subscriber sets callback here
    subscribe (callback) {
        this._notifyCallback = callback;
    }

    // subscriber cuts ties here
    unsubscribe () {
        this._notifyCallback = () => {};

    }

    // SETTERS FOR UPDATING STATE

    // set selected zone
    setZone (zone) {
        this._zone = zone;
        this.notify();
    }

    // set selected purchase location
    setLocation (location) {
        this._location = location;
        this.notify();
    }

    // set selected travel time
    // if "anytime" is selected, make sure ride count is set
    // to the proper increment
    setTime (time) {
        this._time = time;
        if (time == "anytime") {
            this.setLocation("advance_purchase");
            this.setCount(this.count + (this.currentFare.trips - this.count % this.currentFare.trips));
        }
        this.notify();
    }

    // set selected ride count
    setCount (count) {
        this._count = count;
        this.notify();
    }

    // GETTERS FOR RETREIVING OPTIONS FOR INPUTS

    // get zone options
    get zoneOptions () {
        if (!this.data.zones) { return []; }
        return this.data.zones.map((zone, index) => {
            return {
                label: zone.name,
                value: index
            };
        });
    }

    // get options for ride count input
    // update minumum and step based on minimum quantity
    get countOptions () {
        return {
            value: this.count,
            min: this.currentFare.trips,
            step: this.currentFare.trips,
            max: 100,
        };
    }

    // get options for purchase location select
    // ensuring that "onboard" is disabled when "anytime" is selected
    get locationOptions () {
        return [
            {
                value: "advance_purchase",
                label: "Station Kiosk",
                checked: this.location === "advance_purchase"
            },
            {
                value: "onboard_purchase",
                label: "Onboard",
                checked: this.location === "onboard_purchase",
                disabled: this.time === "anytime"
            }
        ];
    }

    // get options for travel time select
    get timeOptions () {
        return [
            {
                value: "weekday",
                label: "Weekday"
            },
            {
                value: "evening_weekend",
                label: "Evening/Weekend"
            },
            {
                value: "anytime",
                label: "Anytime"
            },
        ];
    }


    // GETTERS FOR RETREIVING STATE

    // calculate current cost based on selected options
    get cost () {
        // 1. convert json string to float
        // 2. convert float to fixed (to prevent float errors)
        // 3. multiply cost by ticket quantity
        // 4. convert to fixed with two decimal places for currency
        var costFixed = parseFloat(this.count).toFixed(2);
        var totalCost = costFixed * this.currentFare.price / this.currentFare.trips ;
        return totalCost.toFixed(2);
    }

    // get currently selected ride count
    get count () {
        return parseInt(this._count);
    }

    // get the currently selected fare object from data
    get currentFare () {
        if (!this.data.zones) { return {}; }
        return this.data.zones[this.zone].fares.filter(fare => {
            return (fare.type === this.time && fare.purchase === this.location);
        })[0];
    }


    // get data object that was retreived from API
    get data () {
        return this._data;
    }

    // get currently selected location
    get location () {
        return this._location;
    }

    // return when helper text
    get whenHelper () {
        if (!this.data.info) { return ""; }
        return this.data.info[this.time];
    }

    // return where helper text
    get whereHelper () {
        if (!this.data.info) { return ""; }
        return this.data.info[this.location];
    }

    // get currently selected travel time
    get time () {
        return this._time;
    }

    // get currently selected zone
    get zone () {
        return this._zone;
    }

}

export default new Store();
