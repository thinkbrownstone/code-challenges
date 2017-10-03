define( function () {
  return ['$scope', '$http', function( $scope, $http ) {
    function resetItem(){
      $scope.main = {
        name : '',
        email : '',
        phone : '',
        id : ''
      };

      $scope.displayForm = '';
    }

    resetItem();

    $scope.addItem = function () {
      resetItem();
      $scope.displayForm = true;
    };

    $scope.saveItem = function () {
      var main = $scope.main;

      if ( main.id.length == 0 ) {
        $http.get( '/main/create?name=' + main.name + '&email=' +  main.email + '&phone=' +  main.phone ).success( function( data ) {
          $scope.items.push( data );
          $scope.displayForm = '';
          removeModal();
        }).error( function( data, status, headers, config ) {
          alert( data.summary );
        });
      }
      else {
        $http.get( '/main/update/' + main.id + '?name=' + main.name + '&email=' +  main.email + '&phone=' +  main.phone ).success( function( data ) {
          $scope.displayForm = '';
          removeModal();
        }).error( function( data, status, headers, config ) {
          alert( data.summary );
        });
      }
    };

    $scope.editItem = function( data ) {       
      $scope.main = data;
      $scope.displayForm = true;
    };

    $scope.removeItem = function( data ) {
      if ( confirm( 'Do you really want to delete?' ) ){
        $http['delete']( '/main/' + data.id ).success( function() {
          $scope.items.splice( $scope.items.indexOf( data ), 1 );
        });
      }
    };

    $http.get( '/main/find' ).success( function( data ) {
      for ( var i = 0; i < data.length; i++ ) {
        data[i].index = i;
      }

      $scope.items = data;
    });

    function removeModal(){
      $( '.modal' ).modal( 'hide' );          
    }
  }];
});
