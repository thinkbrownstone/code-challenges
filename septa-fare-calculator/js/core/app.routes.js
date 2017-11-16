angular.module('septaApp').config(['$stateProvider','$urlServiceProvider',function($stateProvider,$urlServiceProvider) {
    $urlServiceProvider.rules.otherwise({ state: 'home' });
    
    $stateProvider
    
    .state('home', {
        url: '/home',
        component: 'homeComponent'
    })
}]);
