require.config({
  //urlArgs: "bust=" + (new Date()).getTime(),
  urlArgs: "bust=81295073",
  paths: {
    'angular': '//ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min',
    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min',
    'jquery-ui': '../vendor/jquery/jquery-ui-1.11.2.min',
    'bootstrapJs': '../vendor/bootstrap/bootstrap'
  },

  /**
   * for libs that either do not support AMD out of the box, or
   * require some fine tuning to dependency mgt'
   */
  shim: {
    "jquery-ui": {
      exports: "$",
      deps: ['jquery']
    },
    'bootstrapJs': ['jquery'],
    'angular': {'exports': 'angular'}
  }
});

window.name = "NG_DEFER_BOOTSTRAP!";

require( [ 'angular', 'app', 'bootstrapJs' ], function( angular, app ) {
  'use strict';

  var $html = angular.element( document.getElementsByTagName( 'html' )[0] );

  angular.element( ).ready( function( ) {
    angular.resumeBootstrap( [app.name] );
  });
});
