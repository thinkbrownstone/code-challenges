(function () {
  angular
      .module('app')
      .component('septaFareWidget', {
          controller: SeptaFareWidgetController,
          templateUrl: 'src/SeptaFareWidget/SeptaFareWidget.template.html'
      });

      SeptaFareWidgetController.$inject = ['SeptaFareWidgetService'];

      function SeptaFareWidgetController(SeptaFareWidgetService) {
          /* VARIABLES */
          // Easy Reference 
          var ctrl = this;

          // Non View
          var info = null;
          var cleanTimes = {
            weekday: 'Weekday',
            evening_weekend: 'Evening Weekend',
            anytime: 'Anytime'
          };
          var dirtyTimes = {
            'Weekday': 'weekday',
            'Evening Weekend': 'evening_weekend',
            'Anytime': 'anytime'
          };

          // View
          this.zones = null;
          this.times = [];
          this.gotData = false;
          this.selectedZone = null;
          this.selectedTimes = null;
          this.purchasePlace = 'advance_purchase';
          this.purchaseCount = 0;
          this.purchaseTotal = (0).toFixed(2);
          this.timeHelperText = null;

          /* Life Cycle Hookes */

          this.$onInit = function() {
            SeptaFareWidgetService.getSeptaDetails()
              .then(function (details) {
                ctrl.info = details.info;
                ctrl.zones = details.zones;
                ctrl.gotData = true;
              }, function (err) {
                console.error(err);
              });
          };

          /* Methods */
          this.filterTimes = filterTimes;
          this.calculate = calculate;


          /* Functions */

          function filterTimes() {
            // Reset Times 
            ctrl.times = [];
            var fares = ctrl.selectedZone.fares;
            
            for (var i = 0; i < fares.length; i++) {
              var type = fares[i].type;
              if (ctrl.times.indexOf(cleanTimes[type]) === -1) {
                ctrl.times.push(cleanTimes[type]);
              }
            }
          }

          function calculate(type) {
            var fares = ctrl.selectedZone.fares;
            var selectedTime = dirtyTimes[ctrl.selectedTime];
            var matchingFare;

            if (type === 'time') {
              ctrl.timeHelperText = ctrl.info[selectedTime];
              if (selectedTime === 'anytime') {
                ctrl.purchasePlace = 'advance_purchase';
              }
            }

            // Match the correct Fare
            for (var i = 0; i < fares.length; i++) {
              var fare = fares[i];
              if (fare.type === selectedTime) {
                if (fare.purchase === ctrl.purchasePlace) {
                  matchingFare = fare;
                  break;
                }
              }
            }

            if (selectedTime !== 'anytime') {
              ctrl.purchaseTotal = (matchingFare.price * ctrl.purchaseCount).toFixed(2);
            } else if (selectedTime === 'anytime') {
              ctrl.purchaseTotal = (matchingFare.price * (ctrl.purchaseCount / 10)).toFixed(2);
            }

          }

      }

})();