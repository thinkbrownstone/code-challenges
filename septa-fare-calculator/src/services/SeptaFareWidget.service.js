(function () {
  angular
    .module('app')
    .service('SeptaFareWidgetService', SeptaFareWidgetService);

    SeptaFareWidgetService.inject = ['$http', '$q'];

    function SeptaFareWidgetService($http, $q) {

        this.getSeptaDetails = getSeptaDetails;


        function getSeptaDetails() {
            var def = $q.defer();
            
            $http({
                method: 'get',
                url: 'fares.json'
            }).then(function (r) {
                def.resolve(r.data);
            }, function (r) {
                def.reject(r);
            });

            return def.promise;
        }
    }
})();