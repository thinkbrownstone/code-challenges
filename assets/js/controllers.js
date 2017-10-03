define( function ( require ) {
  
  var angular = require( 'angular' ),
      Controllers = angular.module( 'controllers', [] );
  
  Controllers.controller( 'angLoginController', require( 'controllers/angLoginController' ) );
  
  return Controllers;
  
});
