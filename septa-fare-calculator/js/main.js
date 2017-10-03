var fares = {
    // values to be populated from the API (fares.json)
    when: [],
    zones: [],
    purchaseLocs: ['Station Kisok', 'OnBoard'],
    rides: 1,
    appStatus: 'Loading'
};

var viewModel = {
    // data and rendered choices
    zones: ko.observableArray(),
    appStatus: ko.observable(),
    when: ko.observableArray(),
    purchaseLocs: ko.observableArray(),
    rides: ko.observable(),
    currentPrice: ko.observable(),

    // app functions
    loadFares: function() {
        // Loads data from the API and
        // populates the 'fares' model.
        var faresJSON = 'fares.json';

        // the async request
        $.getJSON(faresJSON, function(d) {
            var len = d.length,
                when = [];

            // check for data
            if (len === 0) {
                // update the status
                viewModel.status('No data available');
            } else {
                // add fares to the fares model

                when = Object.keys(d.info);
                when.pop(3);
                when.pop(4);
                fares.when = when;
                fares.zones = d.zones;

                // update the status
                fares.appStatus = 'OK';

                // populate the observables
                viewModel.when(fares.when);
                viewModel.zones(fares.zones);
                viewModel.appStatus(fares.appStatus);

                // run the widget
                viewModel.init();
            }
        }).fail(function() {
            // if the request fails for some reason
            viewModel.appStatus('Failed to load resource.');
        });
    },
    calculateFare: function(zone, when, where, rides) {
        // static function:
        // takes in zone, when, where, rides ->
        // returns the fare
        var all_zones = this.zones(),
            index = zone - 1,
            totalFare = 0;

        if (when === 'weekday') {
            if (where === '0') {
                totalFare = all_zones[index].fares[0].price * rides;
            } else {
                totalFare = all_zones[index].fares[1].price * rides;
            }
        } else if (when === 'evening_weekend') {
            if (where === '0') {
                totalFare = all_zones[index].fares[2].price * rides;
            } else {
                totalFare = all_zones[index].fares[3].price * rides;
            }
        } else {
            // anytime
            totalFare = all_zones[index].fares[4].price * rides;
        }

        // display '0' as currency
        if (totalFare % 1 === 0){
            totalFare = totalFare + '.00';
        }

        return totalFare;
    },

    getFare: function() {
        // returns the current fare price
        var totalFare = 0,
            currentZone = $('.zone').val(),
            currentWhen = $('.when').val(),
            currentWhere = $('.where').val(),
            currentRides = parseFloat($('.rides').val());

        // calculate the cost of the trip
        switch(currentZone) {
            case '1':
                totalFare = this.calculateFare(1, currentWhen, currentWhere, currentRides);
                break;
            case '2':
                totalFare = this.calculateFare(2, currentWhen, currentWhere, currentRides);
                break;
            case '3':
                totalFare = this.calculateFare(3, currentWhen, currentWhere, currentRides);
                break;
            case '4':
                totalFare = this.calculateFare(4, currentWhen, currentWhere, currentRides);
                break;
            case '5':
                totalFare = this.calculateFare(5, currentWhen, currentWhere, currentRides);
                break;
        }

        this.currentPrice(totalFare);
        return totalFare;

    },

    init: function() {
        // populate some observables
        this.when(fares.when);
        this.purchaseLocs(fares.purchaseLocs);
        this.rides(fares.rides);

        // calculate the intial price from the defaults
        this.currentPrice(this.getFare());
    }
};

ko.applyBindings(viewModel);
// call to load the data from the API
viewModel.loadFares();