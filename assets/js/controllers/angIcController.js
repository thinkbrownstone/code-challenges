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

      //$http.get( '/iclogin?email=' + login.email + '&lk=' +  login.lk + '&sk=' +  login.sk ).success( function( data )
      $http.post( '/iclogin?email', login ).success( function( data )
      {
        if ( data.success === true ) {
          $scope.closeLoginPopup( );
          $scope.tData = data;
          dpic.currentKey = data.customer.key;

          $scope.timesheet.displayList( );
        }
        else {
          $scope.message( 'login-error-message', data.message );
        }
      }).error( function( data, status, headers, config ) {
        $scope.message( 'login-error-message', 'Oops, Please try it later!' );
      });
    };

    $scope.timesheet = {
      displayList: function( )
      {
        var iData = $scope.tData.ic_list[0],
          cData = $scope.tData.customer.cdata[0],
          icphone = ( iData.ic_phone === null || iData.ic_phone.length === 0 ) ? 'Phone #: N/A' : iData.ic_phone.length,
          billTo = cData.company + '<br />' + cData.address + '<br />' + cData.city + ', ' + cData.state + ' ' + cData.zip
                 + '<br />Phone: ' + cData.phone + ' Fax: ' + cData.fax,
          icne = '<div class="nameemail">'
               +    '<div class="icemail full-line">' + iData.ic_email + '</div>'
               +    '<div class="icphone full-line">' + icphone + '</div>'
               + '</div>',
          weekendD = iData.week_ending,
          html = '<div class="centerGoldenTab full-line">' + dpic.clientCompany( iData ) + '<div class="btn btn-red logoff">Log Off</div></div>'
               + dpic.tabBuilder( 'billTo', 'Referral Agency:', billTo, 'bt-company', 'basic1Tab full-line', 'blue-14-bold referalAgy', 'dblue-14' )
               + dpic.tabBuilder( 'icEmailPhone', 'Profile:', icne, 'ic-name', 'basic1Tab full-line', 'blue-14-bold', '' )
               + dpic.tabBuilder( 'weekEnd', 'Week Ending on:', weekendD, 'wk-ending', 'basic1Tab full-line', 'blue-14-bold referalAgy', 'dblue-14' )
               //+ '<div class="centerGoldenTab full-line white-14-bold">You Can "Authorize All" At The Bottom</div>'
               + '<div class="btn btn-gold showAllDetails plusAll">Show All Detail <span class="clickable-14-18-arrow">&gt;</span></div>'
               + '<div class="btn btn-black showAllDetails minusAll">Hide All Detail <span class="clickable-14-18-arrow">&lt;</span></div>'
               + '<div class="helpHolder"></div>'
               + dpic.allTimer( $scope.tData.ic_list ) 
               + dpic.doAllButtons( );

        $( "html, body" ).animate( { scrollTop: 0 }, 'slow' );
        $( 'body' ).addClass( 'darkgreen icbody' );
        $( '.container' ).removeClass( 'iclogin' ).addClass( 'icAuth' );
        $( '#mainSection' ).removeClass( 'agreement' ).addClass( 'timesheet' ).html( html );
        $( '.loginSection' ).removeClass( 'loginSection' );

        $( '.buttonLine' ).hide( );
        $( '.wk-ending' ).html( dpic.getWeekDay( dpic.weekend, 'long' ) + ', ' +  dpic.getFullDate( dpic.weekend ) );
        $( '#clNameEdit' ).appendTo( '.clNameTab' );
        $( '.nameemail' ).appendTo( '.clNameTab' );
        $( '#helpBtn' ).show().appendTo( '.helpHolder' );
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

      $( '.authTotal' ).unbind( 'click' ).bind( 'click', function( e ) {
        $scope.approveICTotal( $( this ) );
      });

      $( '.agreeTime' ).unbind( 'click' ).bind( 'click', function( e ) {
        var pkey = $( this ).parents( '.inner-box' ).attr( 'pkey' ),
            icFullTab = $( this ).parents( '.icFullTab' ),
            icTimeObj = $( '#ic' + pkey );

        $( '.overall' ).hide( );
        icFullTab.find( '.summaryBtns' ).hide( );
        $( '.showAllDetails' ).hide( );

        $scope.agreeTime( icTimeObj, pkey );
      });

      $( '.disagreeTime' ).unbind( 'click' ).bind( 'click', function( e ) {
        var pkey = $( this ).parents( '.inner-box' ).attr( 'pkey' ),
            icFullTab = $( this ).parents( '.icFullTab' ),
            icTimeObj = $( '#ic' + pkey );

        $scope.disagreeTime( icTimeObj, pkey, icFullTab );
      });

      $( '.logoff' ).unbind( 'click' ).bind( 'click', function( e ) {
        window.location.reload( false );
      });

      $( '.authOverAll' ).unbind( 'click' ).bind( 'click', function( e ) {
        $scope.authOverAll( );

        $( this ).hide( );
        $( '.submitOverAll' ).show( );
      });
    };

    $scope.authOverAll = function( )
    {
      $( '#mainSection' ).children().each( function( e ) {
        if ( $( this ).hasClass( 'icFullTab' ) === true ) {
          var icFObj = $( this ),
              authTotal = icFObj.find( '.authTotal' );

          $scope.approveICTotal( authTotal );
        }
      });

      $( '.submitOverAll' ).unbind( 'click' ).bind( 'click', function( e ) {
        $scope.submitOverAll( );
        $( this ).hide( );
      });
    };

    $scope.submitOverAll = function( )
    {
      $( '#mainSection' ).children().each( function( e ) {
        if ( $( this ).hasClass( 'icFullTab' ) === true ) {
          var icFObj = $( this );

          $scope.submitAll( icFObj );
        }
      });
    };

    $scope.approveICTotal = function( approveIC )
    {
      var icFObj = approveIC.parents( '.icFullTab' );

      approveIC.hide( );
      icFObj.find( '.clearIC' ).show( ).unbind( 'click' ).bind( 'click', function( e ) {
        var icFullTab = $( this ).parents( '.icFullTab' );

        $( this ).hide( );
        icFullTab.find( '.approveIC.authTotal' ).show( );
        icFullTab.find( '.approveIC.submitTotal' ).hide( );

        $scope.allBackNormal( icFullTab );
      });

      icFObj.find( '.approveIC.submitTotal' ).show( ).unbind( 'click' ).bind( 'click', function( e ) {
        var icFullTab = $( this ).parents( '.icFullTab' );

        $scope.submitAll( icFullTab );
      });

      icFObj.children().each( function( e ) {
        if ( $( this ).hasClass( 'inner-box' ) === true ) {
          var pkey = $( this ).attr( 'pkey' ),
              icTObj = $( '#ic' + pkey ),
              cdkey = icTObj.parent().attr( 'ckey' );

          if ( $( this ).hasClass( 'agreeTab' ) === true ) {
            // don't do anything
          }
          else if ( $( this ).hasClass( 'pendingTab' ) === true ) {
            $scope.agreeTime( icTObj, pkey );                
          }
          else if ( $( this ).hasClass( 'disagreeTab' ) === true ) {
            if ( dpic.disagreeArr[cdkey] > 0 ) {
              dpic.disagreeArr[cdkey] --;
            }

            if ( dpic.disagreeArr[cdkey] === 0 ) {
              icTObj.parent().removeClass( 'hasDisagree' );
            }

            icTObj.addClass( 'pendingTab' ).removeClass( 'disagreeTab' );
            $scope.agreeTime( icTObj, pkey );                
          }
        }
      });
    };

    $scope.allBackNormal = function ( icFObj )
    {
      icFObj.children().each( function( e ) {
        if ( $( this ).hasClass( 'inner-box' ) === true ) {
          var pkey = $( this ).attr( 'pkey' ),
              icTObj = $( '#ic' + pkey ),
              cdkey = icTObj.parent().attr( 'ckey' );

          if ( $( this ).hasClass( 'agreeTab' ) === true ) {
            icTObj.addClass( 'pendingTab' ).removeClass( 'agreeTab' ).removeClass( 'disagreeTab' );
            icTObj.find( '.back-submit' ).hide( );
            icTObj.find( '.dis-agree' ).show( );

            $( '.authOverAll' ).show( );
            $( '.submitOverAll' ).hide( );
          }
        }
      });
    };

    $scope.agreeTime = function ( icTimeObj, pkey )
    {
      icTimeObj.addClass( 'agreeTab' ).removeClass( 'pendingTab' );
      icTimeObj.find( '.dis-agree' ).hide( );
      icTimeObj.find( '.back-submit' ).show( );
      icTimeObj.find( '.icNoChoice' ).hide( );
      icTimeObj.find( '.disagree-note' ).hide( );

      icTimeObj.find( '.backTime' ).unbind( 'click' ).bind( 'click', function( e ) {
        var pkey = $( this ).parents( '.inner-box' ).attr( 'pkey' ),
            icTObj = $( '#ic' + pkey ),
            icFObj = $( this ).parents( '.icFullTab' );

        $scope.backNormal( icTObj, icFObj );
      });

      icTimeObj.find( '.submitTime' ).unbind( 'click' ).bind( 'click', function( e ) {
        var pkey = $( this ).parents( '.inner-box' ).attr( 'pkey' ),
            icTObj = $( '#ic' + pkey );
            note = '',
            listObj = [ { pkey: pkey, approved: 'yes', note: note } ],
            icFObj = $( this ).parents( '.icFullTab' );

        $scope.submit( listObj, icFObj );
      });

      $( '.submitAll' ).unbind( 'click' ).bind( 'click', function( e ) {
        var icFObj = $( this ).parents( '.icFullTab' );

        $scope.submitAll( icFObj );

        icFObj.scrollTop();
      });
    };

    $scope.disagreeTime = function ( icTimeObj, pkey, icFullTab )
    {
      var cndObj = icTimeObj.parent(),
          icNoChoice = icTimeObj.find( '.icNoChoice' ),
          ckey = cndObj.attr( 'ckey' );

      $( '.overall' ).hide( );
      icFullTab.find( '.summaryBtns' ).hide( );
      $( '.showAllDetails' ).hide( );

      if ( dpic.disagreeArr[ckey] === 0 ) {
        cndObj.addClass( 'hasDisagree' );
      }

      dpic.disagreeArr[ckey] ++;

      icTimeObj.addClass( 'disagreeTab' ).removeClass( 'pendingTab' );
      icTimeObj.find( '.dis-agree' ).hide( );
      icTimeObj.find( '.back-submit' ).show( );
      
      var textAreaObj = icTimeObj.find( '.disagree-note' ),
          stime = icTimeObj.find( '.in' + pkey ).html(),
          etime = icTimeObj.find( '.out' + pkey ).html(),
          btime = icTimeObj.find( '.break' + pkey ).html(),
          html = '<select name="noReason" id="noReason' + pkey + '">' + dpic.addSelectOptions( 'reasonNo' ) + '</select>'
               + '<div class="tabLeft full-line timeEnter">'
               +   '<div class="lblue-14-bold">In: </div><input type="text" class="eIn bluefont enterIn' + pkey + '" value="' + stime + '">'
               +   '<div class="lblue-14-bold">Out: </div><input type="text" class="eOut bluefont enterOut' + pkey + '" value="' + etime + '">'
               +   '<div class="lblue-14-bold">Break: </div><input type="text" class="eBreak bluefont enterBreak' + pkey + '" value="' + btime + '">'
               + '</div>';

      if ( icNoChoice.html( ) === '' ) {
        icNoChoice.html( html );

        $( '#noReason' + pkey ).change( function( e ) {
          var enterIn = $( '.enterIn' + pkey ),
              enterOut = $( '.enterOut' + pkey ),
              enterBreak = $( '.enterBreak' + pkey );

          if ( this.value === '1' ) {
            enterIn.val( 'N/A' );            
            enterOut.val( 'N/A' );            
            enterBreak.val( 'N/A' );            
          }
          else {
            if ( enterIn.val( ) === 'N/A' ) {
              enterIn.val( stime );
            }

            if ( enterOut.val( ) === 'N/A' ) {
              enterOut.val( etime );
            }

            if ( enterBreak.val( ) === 'N/A' ) {
              enterBreak.val( btime );
            }
          }
        });
      }

      icNoChoice.show( );

      if ( textAreaObj.val( ).trim() === '' ) {
        textAreaObj.val( dpic.disagreeReason );
      }

      textAreaObj.show().unbind( 'focus' ).on( 'focus', function(e){
        if ( $( this ).val() === dpic.disagreeReason ) {
          $( this ).val( '' );
        };
      });

      $( '.enterOut' + pkey + ',.enterIn' + pkey ).unbind( 'focusout' ).on( 'focusout', function(e){
        var ve = $( this ).val( ),
            noReason = $( '#noReason' + pkey ),
            noReasonVal = noReason.val( );

        dpic.checkInOutTime( ve, $( this ), noReasonVal );
      });

      $( '.enterBreak' + pkey ).unbind( 'focusout' ).on( 'focusout', function(e){
        var ve = $( this ).val( ),
            noReason = $( '#noReason' + pkey ),
            noReasonVal = noReason.val( );

        dpic.checkBreakTime( ve, $( this ), noReasonVal );
      });

      icTimeObj.find( '.backTime' ).unbind( 'click' ).bind( 'click', function( e ) {
        var pkey = $( this ).parents( '.inner-box' ).attr( 'pkey' ),
            icTObj = $( '#ic' + pkey ),
            cdkey = icTObj.parent().attr( 'ckey' ),
            icFObj = $( this ).parents( '.icFullTab' );

        if ( dpic.disagreeArr[cdkey] > 0 ) {
          dpic.disagreeArr[cdkey] --;
        }

        if ( dpic.disagreeArr[cdkey] === 0 ) {
          icTObj.parent().removeClass( 'hasDisagree' );
        }

        $scope.backNormal( icTObj, icFObj );
      });

      icTimeObj.find( '.submitTime' ).unbind( 'click' ).bind( 'click', function( e ) {

        var pkey = $( this ).parents( '.inner-box' ).attr( 'pkey' ),
            noReason = $( '#noReason' + pkey ),
            noReasonVal = noReason.val( ),
            icTObj = $( '#ic' + pkey ),
            cdkey = icTObj.parent().attr( 'ckey' ),
            noteObj = icTObj.find( '.disagree-note' ),
            inObj = icTObj.find( '.eIn' ),
            inVal = inObj.val( ),
            outObj = icTObj.find( '.eOut' ),
            outVal = outObj.val( ),
            dnote = noteObj.val( ).trim( ),
            fnote = dnote.length > 0 ? dnote : 'N/A',
            note = dnote === dpic.disagreeReason ? 'N/A' : fnote,
            icFObj = $( this ).parents( '.icFullTab' ),
            inT = ', In: ' + $( '.enterIn' + pkey ).val( ),
            outT = ', Out: ' + $( '.enterOut' + pkey ).val( ),
            breakObj = $( '.enterBreak' + pkey ),
            breakV = breakObj.val( ),
            breakT = ', Break: ' + breakV,
            detailNote = dpic.reasonNo[noReasonVal] + inT + outT + breakT + ', Note: ' + note;

        if ( dpic.checkDisagreeInfo( note, noReasonVal, noteObj, noReason, detailNote ) === true
          && dpic.checkInOutTime( inVal, inObj, noReasonVal ) === true
          && dpic.checkInOutTime( outVal, outObj, noReasonVal ) === true
          && dpic.checkBreakTime( breakV, breakObj, noReasonVal ) === true ) {
          if ( dpic.disagreeArr[cdkey] > 0 ) {
            dpic.disagreeArr[cdkey] --;
          }

          if ( dpic.disagreeArr[cdkey] === 0 ) {
            icTObj.parent().removeClass( 'hasDisagree' );
          }

          $scope.submit( [ { pkey: pkey, approved: 'no', note: detailNote } ], icFObj );
        }
      });

      $( '.submitAll' ).unbind( 'click' ).bind( 'click', function( e ) {
        var icFObj = $( this ).parents( '.icFullTab' );

        $scope.submitAll( icFObj );
      });
    };

    $scope.backNormal = function ( icTimeObj, icFObj )
    {
      icTimeObj.addClass( 'pendingTab' ).removeClass( 'agreeTab' ).removeClass( 'disagreeTab' );
      icTimeObj.find( '.back-submit' ).hide( );
      icTimeObj.find( '.dis-agree' ).show( );

      icFObj.find( '.summaryBtns' ).hide( );
      $( '.authOverAll' ).show( );
      $( '.submitOverAll' ).hide( );

      $scope.buttonsAction( );
    };

    $scope.submitAll = function ( icFObj )
    {
      var listObj = [],
          sNum = 0,
          eachSubmitError = true,
          cdkey = icFObj.attr( 'ckey' );

      icFObj.children().each( function( e ) {
        if ( $( this ).hasClass( 'inner-box' ) === true && eachSubmitError === true ) {

          var pkey = $( this ).attr( 'pkey' ),
              icTObj = $( this );

          if ( $( this).hasClass( 'agreeTab' ) === true ) {
            sNum ++;
            listObj.push( { pkey: pkey, approved: 'yes', note: '' } );
          }
          else if ( $( this).hasClass( 'disagreeTab' ) === true ) {
            sNum ++;
            var noteObj = icTObj.find( '.disagree-note' ),
                dnote = noteObj.val( ).trim(),
                fnote = dnote.length > 0 ? dnote : 'N/A',
                note = dnote === dpic.disagreeReason ? 'N/A' : fnote,
                noReason = $( '#noReason' + pkey ),
                noReasonVal = noReason.val( ),
                inObj = icTObj.find( '.eIn' ),
                inVal = inObj.val( ),
                outObj = icTObj.find( '.eOut' ),
                outVal = outObj.val( ),
                inT = ', In: ' + $( '.enterIn' + pkey ).val( ),
                outT = ', Out: ' + $( '.enterOut' + pkey ).val( ),
                breakObj = $( '.enterBreak' + pkey ),
                breakV = breakObj.val( ),
                breakT = ', Break: ' + breakV,
                detailNote = dpic.reasonNo[noReasonVal] + inT + outT + breakT + ', Note: ' + note;

            if ( dpic.checkDisagreeInfo( note, noReasonVal, noteObj, noReason, detailNote ) === true
              && dpic.checkInOutTime( inVal, inObj, noReasonVal ) === true
              && dpic.checkInOutTime( outVal, outObj, noReasonVal ) === true
              && dpic.checkBreakTime( breakV, breakObj, noReasonVal ) === true ) {
              if ( dpic.disagreeArr[cdkey] > 0 ) {
                dpic.disagreeArr[cdkey] --;
              }

              if ( dpic.disagreeArr[cdkey] === 0 ) {
                icTObj.parent().removeClass( 'hasDisagree' );
              }

              listObj.push( { pkey: pkey, approved: 'no', note: detailNote } );
            }
            else {
              sNum = 0;
              eachSubmitError = false;
            }
          }
        }
      });

      if ( sNum > 0 ) {
        var iData = $scope.tData.ic_list[0],
            icname = iData.ic_fname + ' ' + iData.ic_lname,
            submitData = { list: listObj, key: dpic.currentKey, auth_name: icname };
console.log( submitData );

        icFObj.find( '.summaryBtns' ).hide( );
        $( '.overall' ).hide( );
        $( '.showAllDetails' ).hide( );
        $scope.saveSubmit( submitData );
      }
    };

    $scope.submit = function ( listObj, icFObj )
    {
      var iData = $scope.tData.ic_list[0],
          icname = iData.ic_fname + ' ' + iData.ic_lname,
          submitData = { list: listObj, key: dpic.currentKey, auth_name: icname };

      icFObj.find( '.summaryBtns' ).hide( );
      $( '.overall' ).hide( );
      $( '.showAllDetails' ).hide( );
      $scope.saveSubmit( submitData );
    };

    $scope.saveSubmit = function ( submitData  )
    {
      $http.post( '/icapprove', submitData ).success( function( data ) {
        if ( data.success === true && data.logout === false ) {
          dpic.currentKey = data.key;

          if ( data.processed > 0 ) {
            for ( var k in data.done ) {
              var icT = data.done[k],
                  pkey = icT.pkey,
                  approved = icT.approved === 'yes' ? '"<span class="agree">agree</span>"' : '"<span class="disagree">disagree</span>"',
                  submitT = approved + ' <span class="submitted">Submitted</span>',
                  ictObj = $( '#ic' + pkey ),
                  dtbObj = ictObj.parent( ).children( '.detailBegin' );

              ictObj.children( '.icDetail' ).remove( );
              ictObj.children( '.icButtons' ).remove( );
              ictObj.attr( 'class', 'full-line submittedTab' ).find( '.total' ).html( submitT );
              dtbObj.before( ictObj.show( ) );
            }
          }

          if ( data.blocked > 0 ) {
            var words = data.processed === 1 ? ' has' : 's have',
                pwords = data.blocked === 1 ? ' has' : 's have',
                submitT = data.processed + ' record' + words + ' been processed;<br />However, ' + data.blocked 
                        + ' record' + pwords + ' been changed by Admin.<br /><br />Click "Log Off" and relogin to get updated records.';

            $( '#popupReflesh' ).html( submitT );
            $( '.icButtons' ).remove( );
            $timeout( function( ) { angular.element( '#refleshBtn' ).trigger( 'click' ); }, 500 );
            $( "html, body" ).animate( { scrollTop: 0 }, 'slow' );
          }
        }
        else {
          alert( 'Your Session Expired, Click OK to Login' );
          window.location.reload( false );
        }
      });
    };

    function resetClNamePopup()
    {
      $scope.clname = { 
        cl_name: $( '.clname' ).html( ),
      };
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

    $scope.openClNamePopup = function ()
    {
      resetClNamePopup();
      $scope.clnameForm = true;
    };

    $scope.closeClNamePopup = function ()
    {
      $scope.clnameForm = false;
      removeModal();
    };

    $scope.saveClName = function ()
    {
      var name = $scope.clname.cl_name.trim();

      if ( name.length > 0 ) {
        $( '.clname' ).html( name );
      }

      $scope.closeClNamePopup( );
    };

    $scope.openHelpPopup = function ()
    {
      $scope.helpForm = true;
    };

    $scope.closeHelpPopup = function ()
    {
      $scope.helpForm = false;
      removeModal();
    };

    function removeModal()
    {
      $( '.modal' ).modal( 'hide' );          
    }
  }];
});

var dpic = {
  disagreeReason: 'Enter correct In/Out/Break time above, and Add additional disagree details here:',
  disagreeArr: [],
  currentKey: '',
  weekend: '',

  clientCompany: function( iData )
  {
    var html = '<div class="welcomeCl basic0Tab">Welcome: ' + iData.ic_fname + ' ' + iData.ic_lname + '</div>';

    return html;
  },

  tabBuilder: function( classname, title, value, valueclass, basictabclass, titlefont, valuefont )
  {
    var id = classname,
      html = dpic.singleTabBuilder( id, classname, title, value, valueclass, basictabclass, titlefont, valuefont, false )
           + '</div>';

    return html;
  },

  singleTabBuilder: function( id, classname, title, value, valueclass, basictabclass, titlefont, valuefont, sumh )
  {
    var html = '<div id="cnd-' + id + '" class="' + classname + 'Tab ' + basictabclass + '" ckey="' + id + '">';

    if ( sumh === true ) {
      html += '<div class="icSummary">';
    }

    html += '<div class="tabLeft ' + classname + '">'
         +    '<div class="' + titlefont + '">' + title + '</div>'
         +    '<div class="' + valuefont + ' ' + valueclass + '">' + value + '</div>'
         +  '</div>';

    return html;
  },

  multeLineTabBuilder: function( id, classname, title, value, valueclass, basictabclass, titlefont, valuefont, sumh )
  {
    var html = '<div id="cnd-' + id + '" class="' + classname + 'Tab ' + basictabclass + '" ckey="' + id + '">';

    if ( sumh === true ) {
      html += '<div class="icSummary">';
    }

    html += '<div class="tabLeft ' + classname + '">'
         +    '<div class="' + titlefont + '">' + title + '</div>'
         +    '<div class="' + valuefont + ' ' + valueclass + '">' + value + '</div>'
         +  '</div>';

    return html;
  },

  addSelectOptions: function( id )
  {
    var html = '',
        listObj = {};

    if ( id === 'reasonNo' ) {
      listObj = dpic.reasonNo;
    }

    for ( var ky in listObj ) {
      var iData = listObj[ky],
          idk = '',
          selected = '',
          itemText = '';

       idk = ky;
       itemText = listObj[ky];

       if ( ky === '0' ) {
          selected = ' selected="selected"';
       }

      html += '<option value="' + idk + '"' + selected + '>' + itemText + '</option>';
    }

    return html;
  },

  allTimer: function( iData )
  {
    var firstIc = iData[0],
        current_client_ky = firstIc.client_ky,
        id = current_client_ky,
        classname = 'icName full-line icFull',
        title = 'Worked At:',
        valueclass = 'ic-name',
        basictabclass = 'basic1Tab double_space',
        titlefont = 'macha-14-bold',
        totalMinutes = 0,
        valuefont = 'dgreen-14-bold',
        html = dpic.singleTabBuilder( id, classname, title, firstIc.parent + ' / ' + firstIc.department, valueclass, basictabclass, titlefont, valuefont, true ),
        detailsHtml = '',
        sumHtml = '',
        detailBegin = '<div class="detailBegin"></div>';

    dpic.disagreeArr[current_client_ky] = 0;

    for ( key in iData ) {
      var ic = iData[key],
          moreId = ic.client_ky;

      dpic.weekend = ic.week_ending;
      dpic.disagreeArr[ic.client_ky] = 0;

      //if ( ic.approved !== '' ) {
      ////  continue;
      //}

      if ( current_client_ky !== ic.client_ky ) {

        sumTime = dpic.getTimeFromMinutes( totalMinutes );
        current_client_ky = ic.client_ky;

        html += sumHtml + dpic.summaryButtons( sumTime ) + '</div>' + detailBegin + detailsHtml + '</div>'
              + dpic.singleTabBuilder( moreId, classname, title, ic.parent + ' / ' + ic.department, valueclass, basictabclass, titlefont, valuefont, true );

        detailsHtml = '';
        sumHtml = '',
        totalMinutes = 0;
      }

      detailsHtml += dpic.singleDetail( ic );
      sumHtml += dpic.singleSum( ic, false );

      totalMinutes += dpic.getMinutes( ic.total_hours );
    }

    sumTime = dpic.getTimeFromMinutes( totalMinutes );
    html += sumHtml + dpic.summaryButtons( sumTime ) + '</div>' + detailBegin + detailsHtml + '</div>';

    return html;
  },

  summaryButtons: function( sumTime )
  {
    return '<div class="full-line summaryBtns">'
         +   '<div class="btn btn-blue approveIC authTotal">Authorize Total Hours: ' + sumTime + '</div>'
         +   '<div class="btn btn-green approveIC submitTotal">Submit Total Hours: ' + sumTime + '</div>'
         +   '<div class="btn btn-gold showDetails plus"><span class="clickable-14-18-arrow">&gt;</span></div>'
         +   '<div class="btn btn-black showDetails minus"><span class="clickable-14-18-arrow">&lt;</span></div>'
         +   '<div class="btn btn-red approveIC clearIC"><span class="clickable-14-18-arrow">x</span></div>'
         + '</div>';
  },

  doAllButtons: function( )
  {
    return '<div class="centerGoldenTab full-line doAllBtns">'
         //+   '<div class="btn btn-blue overall authOverAll">Authorize All</div>'
         //+   '<div class="btn btn-green overall submitOverAll">Submit All</div>'
         +   '<div class="btn btn-red logoff">Log Off</div>'
         + '</div>';
  },

  singleDetail: function( ic )
  {
    var shiftDate = dpic.getWeekDay( ic.shift_date, 'normal' ) + ', ' +  dpic.getFullDate( ic.shift_date ),
        target = ( $.type( ic.service_target ) === 'string' && ic.service_target.length > 0 ) ? ic.service_target : ic.department,
        atml = '',
        tabClass = 'approvedTab',
        authed = '',
        itml = '',
        html = '';

      if ( ic.approved === '' ) {
        tabClass = 'pendingTab';
        atml = '<div class="icButtons full-line">'
             +   '<div class="inbox-button dis-agree">'
             +     '<div class="btn btn-blue agreeTime" >Authorize</div>'
             +     '<div class="btn btn-black disagreeTime" >Disagree</div>'
             +   '</div>'
             +   '<div class="inbox-button back-submit">'
             +     '<div class="icNoChoice full-line"></div>'
             +     '<textarea id="note' + ic.pkey +  '" class="disagree-note bluefont">' + dpic.disagreeReason + '</textarea>'
             +     '<div class="btn btn-green submitAll" >Submit All</div>'
             +     '<div class="btn btn-blue submitTime" >Submit</div>'
             +     '<div class="btn btn-black backTime" >Clear</div>'
             +   '</div>'
             + '</div>';
      }
      else {
        var authName = ic.auth_name.length > 25 ? ic.auth_name.substr( 0, 23 ) + '...' : ic.auth_name,
            authEmail = ic.cl_email.length > 30 ? ic.cl_email.substr( 0, 28 ) + '...' : ic.cl_email,
            splitA = ic.auth_time.split( ':' ),
            thour = splitA[0] + ':' + splitA[1],
            authed = 'Authed';

        atml = '<div class="tabLeft full-line authByCl">';

        if ( ic.approved === 'yes' ) {
          atml += '<div class="sbcName full-line">' + authed + ' by ' + authName + '</div>'
                + '<div class="sbcDate full-line">' + authEmail + ' on ' + ic.auth_date.substr( 0, ic.auth_date.length - 5 ) + ' ' + thour + '</div>';
        }
        else if ( ic.approved === 'no' ) {
          tabClass = 'disapprovedTab',
          authed = 'Submitted';
          atml += '<div class="sbcDate full-line">by ' + authName + ' on ' + ic.auth_date.substr( 0, ic.auth_date.length - 5 ) + ' ' + thour + '</div>';
        }

        atml += '</div>';
      }

      if ( ic.approved === 'no' ) {
        itml = dpic.singleSum( ic, true )
             + '<div class="noteDetail singleLineTab">'
             +   ic.note
             + '</div>';
      }
      else {
        itml = '<div class="tabLeft shift_date full-line">'
             +   '<div class="blue-14-bold shiftDate">' + shiftDate + '</div>'
             +   '<div class="blue-14-bold itemRight total"> Bill Hours: ' + ic.total_hours + '</div>'
             + '</div>'
             + '<div class="tabLeft icDetail">'
             +   '<div class="tabLeft">'
             +     '<div class="dblue-14 full-line">' + ic.ic_fname + ' worked on: ' + target + '</div>'
             +     '<div class="dblue-14 full-line">At: ' + ic.service_address + '</div>'
             +   '</div>'
             +   '<div class="tabLeft full-line">'
             +     '<div class="blue-14-bold">In: </div><div class="dblue-14 in' + ic.pkey + '">' + dpic.timeToAmPm( ic.start_time, true ) + '</div>'
             +     '<div class="blue-14-bold">Out: </div><div class="dblue-14 out' + ic.pkey + '">' + dpic.timeToAmPm( ic.end_time, true ) + '</div>'
             +     '<div class="blue-14-bold">Break: </div><div class="dblue-14 break' + ic.pkey + '">' + ic.break_time + '</div>'
             +   '</div>'
             + '</div>';
             //+ '<div class="sbcDate full-line">by ' + authName + ' on ' + ic.auth_date.substr( 0, ic.auth_date.length - 5 ) + ' ' + thour + '</div>';
      }

      html = '<div id="ic' + ic.pkey +  '"' + ' class="inner-box ' + tabClass + '" pkey="' + ic.pkey + '">'
           +   itml
           +   atml
           + '</div>';

    return html;
  },  

  singleSum: function( ic, noBkg )
  {
    var bkTime = ic.break_time.trim(),
        breakTime = bkTime === '00:00' ? 'no' : bkTime,
        slass = 'simpleTab',
        html = '';

    if ( noBkg === true ) {
      slass = 'singleLineTab';
    }
    else if ( ic.approved === 'yes' ) {
      slass = 'simpleTab yesS';
    }
    else if ( ic.approved === 'no' ) {
      slass = 'simpleTab noS';
    }

    html = '<div id="icS' + ic.pkey +  '"' + ' class="full-line ' + slass + '" pkey="' + ic.pkey + '">'
         +   '<div class="tabLeft shortWD">' + dpic.getWeekDay( ic.shift_date.trim(), 'short' ) + '</div>'
         +   '<div class="tabLeft shortDD">' + dpic.getShortDate( ic.shift_date.trim() ) + ':</div>'
         +   '<div class="tabLeft shortTime">' + dpic.timeToAmPm( ic.start_time.trim(), false ) + ' - ' + dpic.timeToAmPm( ic.end_time.trim(), false ) + '</div>'
         +   '<div class="tabLeft shortBk">' + '(break: ' + breakTime + ')' + '</div>'
         +   '<div class="tabLeft shortHr">' + ic.total_hours.trim() + 'hrs' + '</div>'
         + '</div>';

    return html;
  },

  checkInOutTime: function( fieldVal, fieldObj, noReasonVal )
  {
console.log('ic871');
    var tvalue = fieldVal.trim();

    if ( noReasonVal < 1 || noReasonVal > 1 ) {
      if ( tvalue !== fieldVal ) {
        fieldObj.val( tvalue );
      }

      var apm = tvalue.substr( -2 ),
          tstr = tvalue.substr( 0, tvalue.length - 2 ),
          hasC = tvalue.indexOf( ':' ),
          splitA = tvalue.split( ':' ),
          hours = dpic.hours.indexOf( splitA[0] ),
          minute1 = hasC > 0 ? dpic.minutes1.indexOf( tvalue[hasC + 1] ) : -2,
          minute2 = hasC > 0 ? dpic.minutes2.indexOf( tvalue[hasC + 2] ) : -2;

      if ( !( apm === 'am' || apm === 'pm' ) || hasC < 0 || hours < 0 || minute1 < 0 || minute2 < 0 ) {
        fieldObj.removeClass( 'bluefont' ).addClass( 'errorfont' );
        alert( 'Please enter a time format of "H:MM" with am or pm' );

        return false;
      }
    }

    fieldObj.removeClass( 'errorfont' ).addClass( 'bluefont' );

    return true;
  },

  checkBreakTime: function( fieldVal, fieldObj, noReasonVal )
  {
    var tvalue = fieldVal.trim().toLowerCase();

    if ( noReasonVal < 1 || noReasonVal > 1 ) {
      if ( tvalue !== fieldVal ) {
        fieldObj.val( tvalue );
      }

      var sl = tvalue.length,
          hasC = tvalue.indexOf( ':' ),
          hour1 = ( sl === 5 && hasC === 2 ) ? dpic.hour1.indexOf( tvalue[0] ) : -2,
          hour2 = ( sl === 5 && hasC === 2 ) ? dpic.hour2.indexOf( tvalue[1] ) : -2,
          minute1 = ( sl === 5 && hasC === 2 ) ? dpic.minutes1.indexOf( tvalue[3] ) : -2,
          minute2 = ( sl === 5 && hasC === 2 ) ? dpic.minutes2.indexOf( tvalue[4] ) : -2;

      if ( sl !== 5 || hasC !== 2 || hour1 < 0 || hour2 < 0 || minute1 < 0 || minute2 < 0 ) {
        fieldObj.removeClass( 'bluefont' ).addClass( 'errorfont' );
        alert( 'Please enter break format of "HH:MM" and should be less than 20 hours' );

        return false;
      }
    }

    fieldObj.removeClass( 'errorfont' ).addClass( 'bluefont' );

    return true;
  },

  checkDisagreeInfo: function( note, noReasonVal, noteObj, noReason, detailNote )
  {
    if ( noReasonVal < 1 ) {
      noReason.removeClass( 'bluefont' ).addClass( 'errorfont' );
      alert( 'Please Select One Main Disagree Reason' );

      return false;
    }
    else {
      noReason.removeClass( 'errorfont' ).addClass( 'bluefont' );
    }

    if ( note.length < 3 && noReasonVal > 4 ) {
      noteObj.removeClass( 'bluefont' ).addClass( 'errorfont' );
      alert( 'Please write a few words for "Disagree note"' );

      return false;
    }
    else {
      noteObj.removeClass( 'errorfont' ).addClass( 'bluefont' );
    }

    if ( detailNote.length > 255 ) {
      var cutlength = detailNote.length - 255;

      alert( 'Disagree note is over limit, please cut ' + cutlength + ' charactors' );

      return false;
    }

    return true;
  },

  timeToAmPm: function( hm, m )
  {
    var hhmm = hm.trim( ),
        hsArr = hhmm.split( ':' ),
        hour = parseInt( hsArr[0] ),
        ampm = hour >= 12 ? 'p' : 'a',
        mm = m === true ? 'm' : '',
        h = hour > 12 ? hour - 12 : hour;

    if ( h === 0 ) {
      h = 12;
    }

    return h + ':' + hsArr[1] + ampm + mm;
  },

  getFullDate: function( mdy )
  {
    var dt = new Date( mdy );

    return dpic.month[dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear();
  },

  getShortDate: function( mdy )
  {
    var dt = new Date( mdy );

    return ( dt.getMonth() + 1 ).toString( ) + '/' + dt.getDate( );
  },

  getWeekDay: function( mdy, type )
  {
    var dt = new Date( mdy ),
      n = dt.getDay();

    if ( type === 'long' ) {
      return dpic.weekDaysLong[n];
    }
    else if ( type === 'short' ) {
      return dpic.weekDaysShort[n];
    }

    return dpic.weekDays[n];
  },

  getMinutes: function( s )
  {
    var p = s.split( ':' );

    return parseInt( p[0] ) * 60 + parseInt( p[1] );
  },

  getTimeFromMinutes: function( m )
  {
    var h = Math.floor( m / 60 ),
        mm = m - h * 60,
        mt = mm.toString();

    if ( mt.length < 2 ) {
      mt += '0';
    }

    return h.toString() + ':' + mt;
  },

  hours: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ],
  hour1: [ '0', '1' ],
  hour2: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
  minutes1: [ '0', '1', '2', '3', '4', '5' ],
  minutes2: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
  weekDaysLong: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
  weekDays: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
  weekDaysShort: [ 'Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa' ],
  monthLong: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
  month: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
  reasonNo: [ 'Select One Main Reason', 'Did Not Work', 'Date Incorrect', 'In / Out Time Not Correct' , 'Incorrect Break Time' , 'Incorrect Hours Reported' , 'Wrong Location' , 'Wrong Consumer' , 'Other' ]
};
