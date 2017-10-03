define( function () {
  return ['$scope', '$http', '$timeout', function( $scope, $http, $timeout ) {

    function resetLoginPopup()
    {
      var email = $.urlParam( 'email' ),
          lk = $.urlParam( 'lk' ),
          sk = $.urlParam( 'sk' );

      $scope.login = {
        email: email.length > 0 ? email : '',
        lk: lk.length > 0 ? lk : '',
        sk: sk.length > 0 ? sk : '',
        id: ''
      };

      $( '#login-error-message' ).html( '' ).hide( );
    };

    $.urlParam = function( paramter ){
      var results = new RegExp( '[\\?&]' + paramter + '=([^&#]*)' ).exec( window.location.href );

      if ( !results ) {
        return '';
      }

      return decodeURIComponent(  results[1].replace(/\+/g, " ") ) || 0;
    };

    $scope.tData = { };

    $scope.openLoginPopup = function ()
    {
      resetLoginPopup();
      
      $scope.loginForm = true;
      $( '.aheader' ).addClass( 'ahbk' );
    };

    $scope.changeZone = function ()
    {
      console.log( $scope.selectedItem );
      
      $scope.calculation();
    };
  
    $scope.changeTime = function()
    {
      //console.log( $scope.selectedTime );
      if ( $scope.selectedTime.value === 'anytime') {
        $( '#onboardRadio' ).attr( 'disabled', true ).attr( 'checked', false );
        $( '#advanceRadio' ).attr( 'checked', true );
      //  alert("If you choose 'Anytime', you must enter a number that is multiplier of 10."); 
      }
      else {
        $( '#onboardRadio' ).attr( 'disabled', false ).attr( 'checked', false );
        $( '#advanceRadio' ).attr( 'checked', false );
      }

      $scope.radioValue = '';
      $scope.totalPrice = '';
      //$scope.calculation();
      //console.log( $scope.totalPrice );

      $scope.numbers =[];
     if ( $scope.selectedTime.value === 'anytime') {
     for (var i= 10;i<=100;i=i+10)
     {
       $scope.numbers.push(i);
     }             
      };

      $scope.checkTime1 = function()
      {
        if ( $scope.selectedTime.value === 'anytime')
          return false;
        else
          return true;

        
      };

      $scope.checkTime2 = function()
      {
        if ( $scope.selectedTime.value === 'anytime')
          return true;
        else
          return false;
        
      };
   

    } 
   
    
    $scope.changeTrips = function()
    {

      
        if ( parseInt( $scope.selectedTrips ) % 1 === 0 ) {
          if ( parseInt( $scope.selectedTrips ) !== $scope.selectedTrips ) {
           $scope.selectedTrips = parseInt( $scope.selectedTrips );
         }
      
           $scope.calculation();
         }
         else {
           $scope.selectedTrips = '';
         }
     
   };

     $scope.changeNum = function()
    {
         $scope.calculation();
      
    }


    $scope.changePlace = function() {
      //console.log($scope.radioValue );
      $scope.calculation();
   };

    
    $scope.calculation= function() {


         console.log($scope.selectedNum);
      //console.log('here:' + $scope.radioValue );
      var radioValue = typeof $scope.radioValue === 'undefined' ? '' : $scope.radioValue,
          zone = typeof $scope.selectedItem === 'undefined' ? '' : parseInt( $scope.selectedItem.zone ) - 1,
          timeS = typeof $scope.selectedTime === 'undefined' ? '' : $scope.selectedTime.value,
          trips = typeof $scope.selectedTrips === 'undefined' ? '' : parseInt( $scope.selectedTrips ),
          tripTens = typeof $scope.selectedNum === 'undefined' ? '' : parseInt( $scope.selectedNum ) / 10,
          trip = timeS === 'anytime' ? tripTens : trips;
//console.log( '---------' );
      //console.log( radioValue );

      //console.log( zone );
      //console.log( timeS );
      //console.log( trips );

      //if (timeS = "anytime"){
     
      //trips = Math.max((trips -  trips %10) /10, 0 );

     // };
      if ( radioValue !== '' && zone !== '' && timeS !== '' && trip !== '' ) {
        console.log( $scope.zones );
        var zoneObj = $scope.zones[zone],
            fareObj = zoneObj.fares;
           // console.log( fareObj );
         
        for( var i = 0, len = fareObj.length; i < len; i++ ) {
            var temp = fareObj[i],
                typeTemp = temp.type,
                priceTemp = temp.price,
                purchaseTemp = temp.purchase;
            console.log(temp);
            console.log( typeTemp );
            console.log( purchaseTemp );
            console.log( timeS );
            console.log( radioValue );

            if (typeTemp === timeS && purchaseTemp === radioValue ){
              //if (typeTemp !== "anytime") {
                 // console.log(temp[3]);
                  $scope.totalPrice = '$' + ' '+priceTemp * trip;
              //    break;
              //}
              //else{
                
              //    $scope.totalPrice = '$' + priceTemp * tripTens/10;
                   break;
              //}
               
            }
           
         }
    }

      
      else {
              console.log( radioValue );

      console.log( zone );
      console.log( timeS );
      console.log( trips );
      }
   };



    $scope.closeLoginPopup = function ()
    {
      $scope.loginForm = false;
      $( '.aheader' ).removeClass( 'ahbk' );
      removeModal();
    };

    $scope.message = function ( id, message )
    {
      $( '#' + id ).html( message ).show( );
    };

  

    $scope.submitLogin = function ()
    {
      var login = $scope.login;

      //$http.get( '/clientlogin?email=' + login.email + '&lk=' +  login.lk + '&sk=' +  login.sk ).success( function( data )
      $http.post( '/clientlogin?email', login ).success( function( data )
      {
        if ( data.success === true ) {
          $scope.closeLoginPopup( );

          $scope.septa.displayForm( data.sdata );
        }
        else {
          $scope.message( 'login-error-message', data.message );
        }
      }).error( function( data, status, headers, config ) {
        $scope.message( 'login-error-message', 'Oops, Please try it later!' );
      });
    };

    $scope.whens = [ { name: 'Weekdays', value: 'weekday'},
                         { name: 'Evening or Weekend', value: 'evening_weekend' },
                         { name: 'Anytime', value: 'anytime' } ];

   // $scope.numbers = [1,2,4]; 

   $scope.septa = {

      displayForm: function( sdata )
      {
        //console.log( sdata );
      
        $scope.zones = sdata.zones;
       // console.log( sdata.zones);
         



        $( '.loginSection' ).hide();
        $( '.mainSection' ).removeClass( 'hide');

        return false;
 
        $scope.buttonsAction( );

    

  



      }

      };

 

    $scope.buttonsAction = function ()
    {
      $( '.showDetails' ).unbind( 'click' ).bind( 'click', function( e ) {
        var icFObj = $( this ).parents( '.icFullTab' );

        if ( $( this ).hasClass( 'plus' ) === true ) {
          $( this ).hide( );
          icFObj.find( '.showDetails.minus' ).show( );
          icFObj.find( '.inner-box' ).show( );
        }
        else {
          $( this ).hide( );
          icFObj.find( '.showDetails.plus' ).show( );
          icFObj.find( '.inner-box' ).hide( );
        }
      });

      $( '.showAllDetails' ).unbind( 'click' ).bind( 'click', function( e ) {

        if ( $( this ).hasClass( 'plusAll' ) === true ) {
          $( this ).hide( );
          $( '.showDetails.plus' ).hide( );
          $( '.showAllDetails.minusAll' ).show( );
          $( '.showDetails.minus' ).show( );
          $( '.inner-box' ).show( );
        }
        else {
          $( this ).hide( );
          $( '.showDetails.minus' ).hide( );
          $( '.showAllDetails.plusAll' ).show( );
          $( '.showDetails.plus' ).show( );
          $( '.inner-box' ).hide( );
        }
      });
    };

    $scope.submit = function ( )
    {

    };

    $scope.saveSubmit = function ( submitData  )
    {
      $http.post( '/septaaction', submitData ).success( function( data ) {
        if ( data.success === true && data.logout === false ) {

          if ( data.processed > 0 ) {

          }
        }
        else {
          alert( 'Your Session Expired, Click OK to Login' );
          window.location.reload( false );
        }
      });
    };

    $scope.openRefleshPopup = function ()
    { 
      $scope.refleshForm = true;
    };
    
    $scope.closeRefleshPopup = function ()
    { 
      $scope.refleshForm = false;
      removeModal();
    };

    $scope.reflesh = function ()
    {
      window.location.reload( false );
    };

    $scope.closeClNamePopup = function ()
    {
      $scope.clnameForm = false;
      removeModal();
    };

    function removeModal()
    {
      $( '.modal' ).modal( 'hide' );          
    }
  }];
});
