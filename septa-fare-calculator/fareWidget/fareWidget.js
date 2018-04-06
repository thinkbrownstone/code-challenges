angular.module('fareCalcApp', [])
    .component('fareCalcComp', {
        templateUrl: './fareWidget/fareWidget.html',
        controller: fareCalcController,
        controllerAs: 'vm'
    });

function fareCalcController($http) {
    var vm = this;
    vm.title = 'Regional Rail Fares';

    //Assumption: App knows options for form fields
    vm.zoneOptions = [
        {
            zone: 1,
            name: "CCP/1"
        },
        {
            zone: 2,
            name: "Zone 2"
        },
        {
            zone: 3,
            name: "Zone 3"
        }, {
            zone: 4,
            name: "Zone 4"
        },
        {
            zone: 5,
            name: "NJ"
        }
    ];
    vm.typeOptions = [
        {
            code: 'weekday',
            name: 'Weekday'
        },
        {
            code: 'evening_weekend',
            name: 'Evening or Weekend'
        },
        {
            code: 'anytime',
            name: 'Anytime'
        }
    ];
    vm.purchaseOptions = [
        {
            code: 'onboard_purchase',
            name: 'Onboard'
        },
        {
            code: 'advance_purchase',
            name: 'Station Kiosk'
        }
    ];

    var farePrices;
    vm.selectedZone, vm.selectedType, vm.selectedPurchase, vm.count, vm.ticketType = 'rides';
    vm.hintMessage = 'Please fill in fields.';

    vm.$postLink = function () {
        
        //get fare prices and info text
        $http({
            method: 'GET',
            url: '/fares.json'
        }).then(function success(data) {
            farePrices = data.data.zones;
            _.map(vm.typeOptions, function(item, i){
                item.info = data.data.info[item.code];
            });
        }, function error(err) {
            console.log(err);
        });
    }

    //recalculates fare whenever input is changed
    vm.calculateFare = function () {
        //"lock" purchase location if anytime selected
        if(vm.selectedType && vm.selectedType.code === 'anytime'){
            vm.selectedPurchase = vm.purchaseOptions[1].code;
        }
        //check if all input exists and correct, then find fare from ajax data and format for show
        if(vm.selectedZone && vm.selectedType && vm.selectedPurchase && vm.count && /^\d+$/.test(vm.count)){
            vm.hintMessage = '';
            var destZone = _.find(farePrices, function(zone){ return zone.zone === vm.selectedZone.zone;});
            var destFare = _.find(destZone.fares, function(fare){ return fare.type === vm.selectedType.code && fare.purchase === vm.selectedPurchase; });
            var destMaxFare = _.find(destZone.fares, function(fare){ return fare.type === 'anytime'; });
            vm.total = '$' + (destFare.price * vm.count).toFixed(2);

            //check if anytime pass might save money and display that info.
            if(vm.selectedType.code !== 'anytime' && destFare.price * vm.count >= destMaxFare.price){
                vm.hintMessage = 'Anytime pass could save you money.'
            }
        } else {
            vm.total = '';
            vm.hintMessage = 'Please fill in fields.'
        }
    }


}