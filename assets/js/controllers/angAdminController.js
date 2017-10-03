define( function () {
  return ['$scope', '$http', function( $scope, $http ) {

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

    function resetApproverPopup()
    {
      $scope.approver = {
        email: '',
      };

      $( '#dept-message' ).html( '' ).hide( );
      $( '#dept-error-message' ).html( '' ).hide( );
    };

    $.urlParam = function( paramter ){
      var results = new RegExp( '[\\?&]' + paramter + '=([^&#]*)' ).exec( window.location.href );

      if ( !results ) {
        return '';
      }

      return decodeURIComponent(  results[1].replace(/\+/g, " ") ) || 0;
    };

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

    $scope.openApproverPopup = function ()
    {
      resetApproverPopup( );
      $scope.onFocusEmail( );
      $scope.approverForm = true;
    };

    $scope.closeApproverPopup = function ()
    {
      $scope.approverForm = false;
      removeModal();
    };

    $scope.updateApprover = function ( email )
    {
console.log( email );

      var updates = $scope.approver,
          dept = typeof updates.ddept === 'undefined' ? -1 : updates.ddept,
          uObj = { key: ds.currentKey,
                   email: updates.email,
                   cl_fname: updates.cl_fname,
                   cl_lname: updates.cl_lname,
                   cl_email: updates.cl_email,
                   cl_phone: updates.cl_phone,
                   cl_fax: updates.cl_fax,
                   dept: dept,
                 },
          error = false,
          msgObj = $( '#dept-message' ),
          errorObj = $( '#dept-error-message' );

      msgObj.html( '' ).hide( );
      errorObj.html( '' ).hide( );

      // Check input values
      if ( ds.validateEmail( updates.cl_email ) === false ) {
        errorObj.html( 'Please enter the right email!' ).show( );
console.log( updates.cl_email );
console.log( ds.validateEmail( updates.email ) );

        return false;
      }
      else if ( dept < 0 ) {
        errorObj.html( 'Please select a department' ).show( );

        return false;
      }
      else if ( updates.cl_fname.trim().length === 0 ) {
        errorObj.html( 'Please enter first name' ).show( );

        return false;
      }
      else if ( updates.cl_lname.trim().length === 0 ) {
        errorObj.html( 'Please enter last name!' ).show( );

        return false;
      }

      $http.post( '/adminclientupdate', uObj ).success( function( data ) {
        if ( data.success === true && data.logout === false ) {
          ds.currentKey = data.key;

          if ( data.find === true ) {
            //$scope.submitLogin( );
            var count = data.fcount;

            if ( count > 0 ) {
              var  deptDone = parseInt( data.dData.dept ),
                recordsText = count > 0 ? ' records' : ' record',
                message = deptDone === '0' ? 'All ' : '';

              message += count + recordsText + ' updated!';
              msgObj.html( message ).show( );

              if ( deptDone === 0 ) {
                $scope.doneChangeApprover( );
              }
              else {
                for ( var key in $scope.depts ) {
                  var item = $scope.depts[key];
                  if ( item.did === deptDone ) {
                    $scope.depts.splice( key, 1 );

                    break;
                  }
                }

                if ( $scope.depts.length <= 2 ) {
                  $scope.doneChangeApprover( );
                }
                else {
                  $scope.approver.ddept = 0;
                }
              }

              if ( email === true ) {
                $scope.resendEmail( data.pkeyList, true, msgObj );
              }
            }
            else if ( count < 0 ) {
              errorObj.html( 'Oops, Not found in records! Try it again!' ).show( );
            }
            else {
              errorObj.html( 'Oops, 0 records update! Try another email!' ).show( );
            }
          }
          else {
            errorObj.html( 'Oops, something went wrong. Please try again later.' ).show( );
          }
        }
        else {
          alert( 'Your Session Expired, Click OK to Login' );
          window.location.reload( false );
        }
      });
    };

    $scope.doneChangeApprover = function( )
    {
      $scope.depts = [ { did: -1, name: 'Nothing Left' } ];
      $( '.updateBtn' ).addClass( 'hide' );
    };

    $scope.startChangeApprover = function()
    {
      var dept = $scope.approver, 
          dObj = { key: ds.currentKey, email: dept.email },
          updateObj = $( '.updateApprove' ),
          startBtn = $( '.startBtn' ),
          msgObj = $( '#dept-message' ),
          errorObj = $( '#dept-error-message' );

      msgObj.html( '' ).hide( );
      errorObj.html( '' ).hide( );

      $http.post( '/adminclientdepartment', dObj ).success( function( data ) {
        if ( data.success === true && data.logout === false ) {
          ds.currentKey = data.key;

          if ( data.find === true ) {
            //$scope.submitLogin( );
            var count = data.fcount;

            if ( count > 0 ) {
              var depts = data.dData.dept,
                  deptArr = [ { did: -1, name: 'Select Departments' }, { did: 0, name: 'All Departments' } ],
                  cdata = data.dData.cdata;

              $scope.approver = {
                email: cdata.cl_email,
                cl_email: '',
                cl_fname: '',
                cl_lname: '',
                cl_phone: cdata.cl_phone,
                cl_fax: cdata.cl_fax,
              };

              $( '#updateName' ).html( cdata.cl_fname + ' ' + cdata.cl_lname );
              for ( var i = 0; i < count; i ++ ) {
                var dd = depts[i];

                deptArr.push( { did: dd.client_ky, name: dd.department } );
              }

              $scope.depts = deptArr;
              updateObj.removeClass( 'hide' );
              startBtn.addClass( 'hide' );
            }
            else if ( count < 0 ) {
              errorObj.html( 'Oops, Not found in records! Try it again!' ).show( );
            }
            else {
              errorObj.html( 'Oops, 0 records found! Try another email!' ).show( );
            }
          }
          else {
            errorObj.html( 'Oops, something went wrong. Please try again later.' ).show( );
          }
        }
        else {
          alert( 'Your Session Expired, Click OK to Login' );
          window.location.reload( false );
        }
      });
    };

    $scope.depts = [
      { did: 0, name: 'All' },
    ];
    //$scope.dept = $scope.depts[2];

    $scope.onFocusEmail = function( )
    {
      var updateObj = $( '.updateApprove' ),
          msgObj = $( '#dept-message' ),
          errorObj = $( '#dept-error-message' ),
          startBtn = $( '.startBtn' );

      startBtn.removeClass( 'hide' );
      updateObj.addClass( 'hide' );
      msgObj.html( '' ).hide( );
      errorObj.html( '' ).hide( );
    };

    $scope.message = function ( id, message )
    {
      $( '#' + id ).html( message ).show( );
    };

    $scope.submitLogin = function ()
    {
      var login = $scope.login;

      //$http.get( '/adminlogin?email=' + login.email + '&lk=' +  login.lk + '&sk=' +  login.sk ).success( function( data ) 
      $http.post( '/adminlogin', login ).success( function( data ) {

        if ( data.success === true ) {
          $scope.closeLoginPopup( );
          data.adata = $scope.processData( data.adata );
          sh.tData = data;
          ds.currentKey = data.key;

          $scope.timesheet.displayList( );
        }
        else {
          $scope.message( 'login-error-message', data.message );
        }
      }).error( function( data, status, headers, config ) {
        $scope.message( 'login-error-message', 'Oops, Please try it later!' );
      });
    };

    $scope.checkSession = function ( callback )
    {   
      var ckeckObj = { key: ds.currentKey };

      $http.post( '/admincheck', ckeckObj ).success( function( data ) {
        if ( data.success === true && data.logout === false ) {
          ds.currentKey = data.key;

          callback();
        }
        else {
          alert( 'Your Session Expired, Click OK to Login' );
          //location.href = '/admin';
          window.location.reload( false );
        }
      });
    };

    $scope.setCutoffTime = function ( )
    {
      var region = sh.rData[sh.currentRegion];

      if ( confirm( 'Are you sure you want to set billing week cut-off time for region ' + region.region + ' ?' ) ) {
        var hObj = { key: ds.currentKey, rid: sh.currentRegion };

        $http.post( '/admindsetcutofftime', hObj ).success( function( data ) {
          if ( data.success === true && data.logout === false ) {
            ds.currentKey = data.key;

            if ( data.update === true ) {
              alert( 'Billing week cut-off time for region ' + region.region + ' is set, Click OK to Update Data' );
              $scope.submitLogin( );
            }
            else {
              alert( 'Set Cutoff Time Failed' );
            }
          }
          else {
            alert( 'Your Session Expired, Click OK to Login' );
            //location.href = '/admin';
            window.location.reload( false );
          }
        });
      }
    };

    $scope.sendNewEmail = function ()
    {
      var sendObj = { key: ds.currentKey };

      $http.post( '/adminsendnew', sendObj ).success( function( data ) {
        if ( data.success === true && data.logout === false ) {
          ds.currentKey = data.key;

          alert( 'New Emails Sent, Click OK to Update Data' );
          $scope.submitLogin( );
        }
        else {
          alert( 'Your Session Expired, Click OK to Login' );
          //location.href = '/admin';
          window.location.reload( false );
        }
      });
    };

    $scope.sendNewDemoEmail = function ()
    {
      var sendObj = { key: ds.currentKey };

      $http.post( '/adminsendnewdemo', sendObj ).success( function( data ) {
        if ( data.success === true && data.logout === false ) {
          ds.currentKey = data.key;

          alert( 'New Emails Sent, Click OK to Update Data' );
          $scope.submitLogin( );
        }
        else {
          alert( 'Your Session Expired, Click OK to Login' );
          //location.href = '/admin';
          window.location.reload( false );
        }
      });
    };

    $scope.resendEmail = function ( currentPKeyList, edit, msgObj )
    {
      var sendObj = { key: ds.currentKey, currentPKeyList: currentPKeyList };
//console.log( sendObj );

      $http.post( '/adminresend', sendObj ).success( function( data ) {
        if ( data.success === true && data.logout === false ) {
          ds.currentKey = data.key;

          if ( data.status === 'sent' ) {
            if ( edit === true ) {
              var currentMsg = msgObj.html( );

              msgObj.html( currentMsg + ' Emails resent too!' );
            }
            else {
              alert( 'Emails resent, Click OK to Update Data' );
              $scope.submitLogin( );
            }
          }
          else {
            alert( 'Oops, Resent Email failed, Please try again later' );
          }
        }
        else {
          alert( 'Your Session Expired, Click OK to Login' );
          //location.href = '/admin';
          window.location.reload( false );
        }
      });
    };

    $scope.pushToNextWeek = function ( currentPKeyList, sundayMdy )
    {
      var sendObj = { key: ds.currentKey, currentPKeyList: currentPKeyList, sundayMdy: sundayMdy };
//console.log( sendObj );

      $http.post( '/adminnextweek', sendObj ).success( function( data ) {
        if ( data.success === true && data.logout === false ) {
          ds.currentKey = data.key;

          if ( data.find === true ) {
            alert( data.fcount + ' records pushed to Sunday ' + sundayMdy + ', Click OK to Update Data' );
            $scope.submitLogin( );
          }
          else {
            alert( 'Oops, Pushed to Sunday ' + sundayMdy + ' failed, Please try again later' );
          }
        }
        else {
          alert( 'Your Session Expired, Click OK to Login' );
          //location.href = '/admin';
          window.location.reload( false );
        }
      });
    };

    $scope.timesheet = {
      displayList: function( )
      {
        $( '#mainSection' ).hide( );
        $( '.buttonLine' ).hide( );
        $( '#searchPart' ).show( );

        $( "html, body" ).animate( { scrollTop: 0 }, 'slow' );
        sh.displaySearchBar( 'Create Date' );
        sh.displaySearchFilter( );
        sh.displaySearchResults( );
        $scope.displayFilterButtons( );
        $scope.dataAction( );

        $( '.searchOrder' ).unbind( 'click' ).on( 'click', function(e) {
          sh.billingWeek = false;
          $scope.checkSession( $scope.runSearch );
        });

        $( '.billingWeek' ).unbind( 'click' ).on( 'click', function(e) {
          sh.billingWeek = true;

          var todayMdy = ds.dayToMDY( 1 );

          sh.bwStart = ds.getDefaultBillingStart( todayMdy );
          $scope.checkSession( $scope.runSearch );
        });

        $( '.searchRefresh' ).unbind( 'click' ).on( 'click', function(e) {
          $scope.checkSession( $scope.submitLogin );
        });

        $( '.cutoffTime' ).unbind( 'click' ).on( 'click', function(e) {
          // $scope.sendNewEmail( );
          $scope.setCutoffTime( );
        });
      }
    };

    $scope.runSearch = function( )
    {
      sh.displaySearchResults( );
      $scope.displayFilterButtons( );
      $scope.dataAction( );
    };

    $scope.displayFilterButtons = function( )
    {
      var sendNewObj = $( '.label-emailToNewField' ),
          sendNewDemoObj = $( '.label-emailToNewDemoField' ),
          resendObj = $( '.label-resendEmailField' );
          pushnextObj = $( '.label-pushToNextField' ),
          presetFilter = $( '#presetFilterField' ).val( );

      sendNewObj.hide( ).unbind( 'click' );
      sendNewDemoObj.hide( ).unbind( 'click' );
      resendObj.hide( ).unbind( 'click' );
      pushnextObj.hide( ).unbind( 'click' );

      if ( sh.rowCount > 0 ) {
        if ( sh.filter.emptyInput === true
          && sh.filter.new_record === 'no'
          && sh.filter.region_ky === '1'
          && sh.filter.approved === 'not yet' ) {
          if ( sh.filter.presetFilter === 'tonew' ) {
            sendNewObj.show( );
            $( '#emailToNewField' ).on( 'click', function(e) {
              $scope.sendNewEmail( );
            });

            return;
          }
          else if ( sh.filter.presetFilter === 'tonewdemo' ) {
            sendNewDemoObj.show( );
            $( '#emailToNewDemoField' ).on( 'click', function(e) {
              $scope.sendNewDemoEmail( );
            });

            return;
          }
        }
        else if ( sh.filter.new_record === 'yes' && sh.filter.approved === 'not yet' && presetFilter === 'resend' ) {
          resendObj.show();
          $( '#resendEmailField' ).on( 'click', function(e) {
            $scope.resendEmail( sh.currentPKeyList, false, null );
          });

          return;
        }
        else if ( sh.filter.new_record === 'yes' && sh.filter.approved === 'not yet' && presetFilter === 'nextweek' ) {
          pushnextObj.show();

          var getSundays = ds.getSundaysMdy( ),
              toSundayBtn = $( '#pushToNextField' ),
              btnSundayHtml = '<div class="button pushNext">Push to ' + getSundays.comingSun + '</div>'
                            + '<div class="button pushLast">Push to ' + getSundays.pastSun + '</div>';

          toSundayBtn.html( btnSundayHtml );

          $( '.pushNext' ).on( 'click', function(e) {
            $scope.pushToNextWeek( sh.currentPKeyList, getSundays.comingSun );
          });

          $( '.pushLast' ).on( 'click', function(e) {
            $scope.pushToNextWeek( sh.currentPKeyList, getSundays.pastSun );
          });

          return;
        }
      }

      return false;
    };

    $scope.dataAction = function( )
    {
      $( '.approvalLink' ).unbind( 'click' ).on( 'click', function(e) {
        var Textvalue = $( this ).html().trim(),
          id = $( this ).parent().attr( 'id' ),
          bhtml = '<div class="textValue">' + Textvalue + '</div>'
                + '<div class="btn btn-red timeReset">Reset</div>';

          $( this ).removeClass( 'linkC' ).html( bhtml ).unbind( 'click' );

          $( this ).children( '.timeReset' ).unbind( 'click' ).on( 'click', function(e) {

            var hObj = { key: ds.currentKey, id: id };

            $http.post( '/adminresetapproval', hObj ).success( function( data ) {
              if ( data.success === true && data.logout === false ) {
                ds.currentKey = data.key;

                if ( data.update === true ) {
                  alert( 'Record Reset Successfully, Click OK to Update Data' );
                  $scope.submitLogin( );
                }
                else {
                  alert( 'Record Reset Failed' );
                }
              }
              else {
                alert( 'Your Session Expired, Click OK to Login' );
                //location.href = '/admin';
                window.location.reload( false );
              }
            });

          });
      });

      $( '.deleteLink' ).unbind( 'click' ).on( 'click', function(e) {
        var Textvalue = $( this ).html().trim(),
          id = $( this ).parent().attr( 'id' ),
          bhtml = '<div class="textValue">' + Textvalue + '</div>'
                + '<div class="btn btn-gold recordDelete">Delete</div>';

        $( this ).removeClass( 'linkC' ).html( bhtml ).unbind( 'click' );

        $( this ).children( '.recordDelete' ).unbind( 'click' ).on( 'click', function(e) {
          var hObj = { key: ds.currentKey, id: id };

          $http.post( '/admindeleterecord', hObj ).success( function( data ) {
            if ( data.success === true && data.logout === false ) {
              ds.currentKey = data.key;

              if ( data.update === true ) {
                alert( 'Record Is Deleted Successfully, Click OK to Update Data' );
                $scope.submitLogin( );
              }
              else {
                alert( 'Record Delete Failed' );
              }
            }
            else {
              alert( 'Your Session Expired, Click OK to Login' );
              //location.href = '/admin';
              window.location.reload( false );
            }
          });
        });
      });

      $( '.editLink' ).unbind( 'click' ).on( 'click', function(e) {
        $scope.editTime( $( this ) );
      });

      return false;
    };

    $scope.editTime = function( editLinkObj )
    {
      var Textvalue = editLinkObj.html().trim(),
        rowObj = editLinkObj.parent(),
        id = rowObj.attr( 'id' ),
        editSaveObj = $( '#editSave' ),
        bthtml = Textvalue + '<div class="btn btn-green editSave" id="editSave">Save</div>';

      editSaveObj.parent( ).addClass( 'linkC' ).on( 'click', function(e) {
        $scope.editTime( $( this ) );
      });

      editSaveObj.remove( );

      sh.displayEditTime( rowObj, 'e_s' );
      sh.displayEditTime( rowObj, 'e_e' );
      sh.displayEditTime( rowObj, 'e_b' );
      sh.displayEditTime( rowObj, 'e_t' );

      $( '.editTe_s, .editTe_e, .editTe_t' ).unbind( 'focusout' ).on( 'focusout', function(e){
        var ve = $( this ).val( );

        sh.checkInOutTime( ve, $( this ) );
      });

      $( '.editTe_b' ).unbind( 'focusout' ).on( 'focusout', function(e){
        var ve = $( this ).val( );

        sh.checkBreakTime( ve, $( this ) );
      });

      editLinkObj.removeClass( 'linkC' ).html( bthtml ).unbind( 'click' );

      editLinkObj.children( '.editSave' ).unbind( 'click' ).on( 'click', function(e) {
        var sObj = $( 'input', '#e_sInput' ),
            eObj = $( 'input', '#e_eInput' ),
            bObj = $( 'input', '#e_bInput' ),
            tObj = $( 'input', '#e_tInput' ),
            sValue = sObj.val( ),
            eValue = eObj.val( ),
            bValue = bObj.val( ),
            tValue = tObj.val( ),
            hObj = { key: ds.currentKey, id: id, s: sValue, e: eValue, b: bValue, t: tValue };

        if ( sh.checkInOutTime( sValue, sObj ) === true
          && sh.checkInOutTime( eValue, eObj ) === true
          && sh.checkBreakTime( bValue, bObj ) === true
          && sh.checkInOutTime( tValue, tObj ) === true ) {
          $http.post( '/adminsaveedit', hObj ).success( function( data ) {
            if ( data.success === true && data.logout === false ) {
              ds.currentKey = data.key;

              if ( data.update === true ) {
                if ( data.count > 0 ) {
                  alert( 'Record Is Updated Successfully, Click OK to Refresh Data' );
                }
                else {
                  alert( 'Oops, Record State Was Changed, You Can No Longer Updated It. Click OK to Refresh Data' );
                }
  
                $scope.submitLogin( );
              }
              else {
                alert( 'Record Update Failed' );
              }
            }
            else {
              alert( 'Your Session Expired, Click OK to Login' );
              //location.href = '/admin';
              window.location.reload( false );
            }
          });
        }
      });
    };

    $scope.processData = function( data )
    {
      for ( var key in data ) {
        var iData = data[key];

        data[key].updatedAt = ds.ymdTomdy( data[key].updatedAt );
        data[key].createdAt = ds.ymdTomdy( data[key].createdAt );
        data[key].new_record = data[key].new_record === true ? 'no' : 'yes';
        data[key].approved = ( data[key].approved === '' || data[key].approved === null ) ? 'not yet' : data[key].approved;
      }

      return data;
    };

    function removeModal()
    {
      $( '.modal' ).modal( 'hide' );          
    };
  }];
});

var ds = {
  disagreeReason: 'Enter Disagree Reason / Actual Time & Hours Here:',
  disagreeArr: [],
  currentKey: '',

  validateEmail: function( email )
  {
    var re = /\S+@\S+\.\S+/;

    return re.test(email);
  },

  dayToMDY: function( days ) {
    var time = new Date( ),
      ms = time.getTime(),
      sMs = ms + 86400000 * parseInt( days ),
      stime = new Date( sMs ),
      stymd = stime.toJSON().slice(0, 10),  // yyyy-mm-dd
      stmdy = ds.ymdTomdy( stymd );

    return stmdy;
  },

  getSundaysMdy: function( )
  {
    var d = new Date(),
        ms = d.getTime(),
        n = d.getDay(),
        nDiffComingSunday =  n > 0 ? 7 - n : 0,    // if n === 0, already Sunday,
        msComingSunday = ms + nDiffComingSunday * 86400000,
        msPastSunday = ms + ( nDiffComingSunday - 7 )* 86400000,
        dt = new Date( msComingSunday ),
        m = dt.getMonth() + 1,
        d = dt.getDate(),
        y = dt.getFullYear(),
        pdt = new Date( msPastSunday ),
        pm = pdt.getMonth() + 1,
        pd = pdt.getDate(),
        py = pdt.getFullYear(),
        mdyNext = m + '/' + d + '/' + y,
        mdyPast = pm + '/' + pd + '/' + py;

    return { comingSun: mdyNext, pastSun: mdyPast };
  },

  dTodd: function( d )
  {
    return d > 9 ? d : '0' + d;
  },

  ymdTomdy: function( stymd )
  {
    if ( stymd.indexOf( '/' ) !== -1 && stymd.indexOf( '-' ) === -1 ) {
      return stymd;
    }

    var dt = new Date( stymd ),
        m = dt.getMonth() + 1,
        d = dt.getDate(),
        y = dt.getFullYear(),
        mdy = m + '/' + d + '/' + y;

    if ( stymd.indexOf( 'T' ) !== -1 ) {
      return mdy + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
    }

    return ds.dTodd( m ) + '/' + ds.dTodd( d ) + '/' + y;
  },

  mdyToDays: function( mdy )
  {
    var time = new Date( ),
      ms = time.getTime(),
      stime = new Date( mdy ),
      sms = stime.getTime(),
      diff = Math.floor( ( sms - ms ) / 86400000 ) + 1;

      //console.log( diff );

    return diff;
  },

  compareTime: function( cutoffTime, approveTime )
  {
    var ctime = new Date( cutoffTime ),
        atime = new Date( approveTime ),
        cseconds = ctime.getTime( ),
        aseconds = atime.getTime( );

//console.log( ctime.toJSON() + ' :: ' + atime.toJSON() );  
//console.log( cseconds + ' :: ' + aseconds );  

    return aseconds > cseconds;
  },

  timeToAmPm: function( hm )
  {
    var hsArr = hm.split( ':' ),
        hour = parseInt( hsArr[0] ),
        ampm = hour >= 12 ? 'pm' : 'am',
        h = hour > 12 ? hour - 12 : hour;

    return h + ':' + hsArr[1] + ampm;
  },

  getFullDate: function( mdy )
  {
    var dt = new Date( mdy );

    return ds.month[dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear();
  },

  getDefaultBillingStart: function( mdy )
  {
    var t = new Date( mdy );

    return t.getDay( ) + 4;  // +0: Sun, +1: Sat, +2: Fri, +3: Thu, +4: Wed
  },

  getWeekDay: function( mdy, type )
  {
    var dt = new Date( mdy ),
      n = dt.getDay(),
      weekday = type === 'long' ? ds.weekDaysLong[n] : ds.weekDays[n];

    return weekday;
  },

  weekDaysLong: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
  weekDays: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
  monthLong: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
  month: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
};

sortFirst = ( function( ) {
  function compare( f, direction )
  {
    if ( typeof( f ) !== 'function' ){
      var prop = f;

      f = function( v1, v2 )
      {
        var spacenull = 1;

        if ( v1[prop] === '' ) {
          return spacenull;
        }
        else if ( v2[prop] === '' ) {
          return -spacenull;
        }
        else if ( v1[prop] === null ) {
          return spacenull;
        }
        else if ( v2[prop] === null ) {
          return -spacenull;
        }

        return v1[prop] < v2[prop] ? -1 : ( v1[prop] > v2[prop] ? 1 : 0 );
      };
    }

    if ( direction === -1) {
      return function( v1, v2 ) { return -f( v1, v2 ) };
    }

    return f;
  }

  function extend( f, d )
  {
    f = compare( f, d );
    f.sortThen = sortThen;

    return f;
  }

  function sortThen( y, d )
  {
    var x = this;

    y = compare( y, d );

    return extend( function( a, b ) {
      return x( a, b ) || y( a, b );
    });
  }

  return extend;
})( );

var sh = {
  tData: {},
  currentRegion: '1',
  rData: [],
  cutoffBtnText: 'Set Cut-Off Time &gt;',
  filter: {},
  startEnd: { start: '-30', end: 0 },
  rowCount: 0,
  billingWeek: false,
  bwStart: 0,
  currentPKeyList: [],

  addIField: function( filter )
  {
    var html = '<div class="inputLabel label-' + filter.id + ' inputRequired">'
             +   '<span>' + filter.label + '</span>';

    if ( filter.type === 'input' ) {
      html += '<input type="text" name="' + filter.id + '" id="' + filter.id + '" value="">';
    }
    else if ( filter.type === 'select' ) {
      html += '<select name="' + filter.id + '" id="' + filter.id + '">' + sh.addSelectOptions( filter.id ) + '</select>';
    }
    else if ( filter.type === 'button' ) {
      html += '<div id="' + filter.id + '" class="button filterButton">' + filter.key + '</div>';
    }
    else if ( filter.type === 'holder' ) {
      html += '<div id="' + filter.id + '" class="buttonHolder">' + filter.key + '</div>';
    }

    return html + '</div>';
  },

  addSelectOptions: function( id )
  {
    var html = '',
        listObj = {};

    if ( id === 'regionListField' ) {
      listObj = sh.tData.cdata;
    }
    else if ( id === 'emailSentField' ) {
      listObj = sh.emailSentOption;
    }
    else if ( id === 'approveField' ) {
      listObj = sh.approveOption;
    }
    else if ( id === 'presetFilterField' ) {
      listObj = sh.presetFilterOption;

      if ( sh.tData.region !== 1 ) {
        delete listObj.tonew;
        delete listObj.tonewdemo;
      }
    }

    for ( var ky in listObj ) {
      var iData = listObj[ky],
          idk = '',
          selected = '',
          itemText = '';

      if ( id === 'regionListField' ) {
        sh.rData[iData.id] = iData;

        idk = iData.id.toString( );
        itemText = iData.region;

        if ( idk === '1' ) {
          selected = ' selected="selected"';
        }

        if ( iData.company.length > 0 ) {
          itemText += ' (' + iData.company + ')';
        }
      }
      else {
        idk = ky;
        itemText = listObj[ky]; 

        if ( idk === 'all' ) {
          selected = ' selected="selected"';
        }
      }

      html += '<option value="' + idk + '"' + selected + '>' + itemText + '</option>';
    }

    return html;
  },

  displaySearchBar: function( dateField )
  {
    var html = '<div class="searchBy">Search By:</div>'
             +   '<div class="searchLabel">'
             +     '<span>' + dateField + ' Between</span>'
             +     '<input type="text" name="start" id="start" value="">'
             +     '<span>and</span>'
             +     '<input type="text" name="end" id="end" value="">'
             +     '<div class="button btn-gold searchRefresh">Refresh</div>'
             //+     '<div class="button btn-blue billingWeek">Billing Week</div>'
             +     '<div class="button btn-base searchOrder">Search</div>'
             +   '</div>'
             + '</div>';

    $( '#searchBar' ).html( html );

    $('#start').attr( 'maxlength', '10' ).attr( 'readonly', true );
    $('#end').attr( 'maxlength', '10' ).attr( 'readonly', true );

    require([ "jquery", "jquery-ui" ], function( $ ) {
      $('#start').datepicker({
        showOn: "button",
        buttonImage: "images/calendar-icon.png",
        buttonImageOnly: true,
        buttonText: "Select date",
        changeMonth: true,
        changeYear: true,
      });
      $('#end').datepicker({
        showOn: "button",
        buttonImage: "images/calendar-icon.png",
        buttonImageOnly: true,
        buttonText: "Select date",
        changeMonth: true,
        changeYear: true,
      });
    });
  },

  displaySearchFilter: function( )
  {
    var html = '';

    for ( var key in sh.filterFields ) {
      filter = sh.filterFields[key];

      html += sh.addIField( filter );
    }

    $( '#filterBar' ).html( html );
    //$( '.label-regionListField ' ).append( '<div class="button btn-red cutoffTime">' + sh.cutoffBtnText + '</div>' );

    $( '#presetFilterField' ).change( function( e ) {
      sh.presetFilter( this.value );
    });

    //$( '#regionListField' ).change( function( e ) {
    //  sh.changeRegion( this.value );
    //});
  },

  displayEditTime: function( rowObj, className )
  { 
    var sObj = rowObj.children( '.' + className ),
        shtml = sObj.html( ),
        vhtml = sObj.children( '.textValue').html( ),
        e_sInputObj = $( '#' + className + 'Input' );

    e_sInputObj.remove( );
    sObj.html( shtml + '<div id="' + className + 'Input"><input class="editT' + className + '" type="text" name="' + className + 'Input" value="' + vhtml + '"></div>' );
  },

  changeRegion: function( value )
  {
    var rdata = sh.rData[value],
        cutoffTimeObj = $( '.cutoffTime' );

    //console.log( value );
    //console.log( sh.rData[value] );
    if ( value === '1' ) {
      cutoffTimeObj.hide( );
    }
    else {
      if ( rdata.closed === false ) {
        cutoffTimeObj.html( ds.ymdTomdy( rdata.cutoff_time ) + ' &gt;' );
      }
      else {
        cutoffTimeObj.html( sh.cutoffBtnText );
      }

      cutoffTimeObj.show( );
    }

    sh.currentRegion = value;
  },

  presetFilter: function( value )
  {
    var approvalObj = $( '#approveField' ),
        regionListObj = $( '#regionListField' ),
        icFirstnameObj = $( '#icFirstnameField' ),
        icLastnameObj = $( '#icLastnameField' ),
        clientObj = $( '#clientField' ),
        departmentObj = $( '#departmentField' ),
        targetObj = $( '#targetField' ),
        clemailObj = $( '#clemailField' ),
        emailsentObj = $( '#emailSentField' );


    if ( value === 'resend' ) {
      approvalObj.val( 'not yet' );
      emailsentObj.val( 'yes' );
    }
    else if ( value === 'tonew' || value === 'tonewdemo' || value === 'nextweek' ) {
      approvalObj.val( 'not yet' );
      regionListObj.val( 1 );
      icFirstnameObj.val( '' );
      icLastnameObj.val( '' );
      clientObj.val( '' );
      departmentObj.val( '' );
      targetObj.val( '' );
      clemailObj.val( '' );

      if ( value === 'nextweek' ) {
        emailsentObj.val( 'yes' );
      }
      else {
        emailsentObj.val( 'no' );
      }
    } 
    else if ( value === 'edit' ) {
      approvalObj.val( 'not yet' );
    }
    else if ( value === 'default' ) {
      approvalObj.val( 'all' );
      emailsentObj.val( 'all' );
      regionListObj.val( 1 );
      icFirstnameObj.val( '' );
      icLastnameObj.val( '' );
      clientObj.val( '' );
      departmentObj.val( '' );
      targetObj.val( '' );
      clemailObj.val( '' );

      $( '#presetFilterField' ).val( 'none' );
    } 

  },

  displaySearchResults: function( )
  {
    var sData = sh.tData.adata;

    if ( sh.setupFilter( ) === false ) {
      return false;
    }

    var html = '',
      titleHtml = '';

    //console.log( sData );

    for ( var i = 0; i < sh.fields.length; i++ ) {
      var item = sh.fields[i],
        key = item.key,
        title = item.title,
        sortClass = ( item.sort === true ) ? ' sortField' : '';


      if ( key === 'pkey' && sh.filter.presetFilter === 'edit' ) {
        ; // display
      }
      else if ( key === 'billingweek_cutofftime' && sh.filter.presetFilter === 'nextweek' ) {
        ; // display
      }
      else if ( item.display === false && sh.filter.presetFilter !== 'showall' ) {
        continue;
      }

      titleHtml += '<td class="titleField' + sortClass + '">' + title + '</td>';
    }

    html += '<table class="rData"><tbody>'
          +   '<tr class="rTitle">'
          +     titleHtml
          +   '</tr>'
          +   sh.displayData( sData, 1, 5000 )
          + '</tbody></table>';
    html += '<div class="dataRow">Number of Records Found: ' + sh.rowCount + '</div>';

    $( '#searchResults' ).html( html );
  },

  setupFilter: function( sData )
  {
    //var cid = parseInt( $( '.labelCustomer select').val( ) ),
    //var cid = document.employmenthistory.cid.value.trim(),

    var fVaules = {},
      emptyInput = true,
      sValues = {},
      startObj = $( '#start' ),
      endObj = $( '#end' ),
      presetFilterObj = $( '#presetFilterField' ).val(),
      start = startObj.val( ).trim(),
      end = endObj.val( ).trim(),
      daysStart = parseInt( sh.startEnd.start ),
      daysEnd = parseInt( sh.startEnd.end );

    if ( start === '' || end === '' ) {
      startObj.val( ds.dayToMDY( sh.startEnd.start ) );
      endObj.val( ds.dayToMDY( sh.startEnd.end + 1 ) );
    }
    else {
      daysStart = ds.mdyToDays( start );
      daysEnd = ds.mdyToDays( end );

      if ( daysStart < parseInt( sh.startEnd.start ) ||
           ( daysEnd > parseInt( sh.startEnd.end ) && parseInt( sh.startEnd.end ) < 0 ) ) {

        // do new search,
        sh.startEnd = {  start: daysStart, end: daysEnd };
      }
    }

    for ( var ky in sh.filterFields ) {
      var eachF = sh.filterFields[ky];

      if ( eachF.type === 'input' ) {
        fVaules[eachF.key] = $( '#' + eachF.id ).val( );

        if ( fVaules[eachF.key].length > 0 ) {
          emptyInput = false;
        }
      }
      else if ( eachF.type === 'select' ) {
        sValues[eachF.key] = $( '#' + eachF.id ).val( );
      }
    }

    sValues.start = daysStart;
    sValues.end = daysEnd;
    sValues.checkempty = fVaules;
    sValues.emptyInput = emptyInput;
    sValues.presetFilter = presetFilterObj;

    sh.filter = sValues;
//console.log( sh.filter );

    return true;
  },

  displayData: function( sData, startNum, endEum )
  {
    sData.sort( sortFirst( 'candidate_ky', -1 ).sortThen( 'auth_date', -1 ).sortThen( 'auth_time', -1 ) );

    var dataHtml = '',
      pData = sData,
      i = startNum,
      currentPKeyList = [],
      rowCount = 0;

//console.log( pData );

    for ( var key in pData ) {
      if ( i > endEum ) {
        break;
      }

      var data = pData[key],
        bred = false,
        days = parseInt( data.days );

      // Apply Filter Start, apply billingWeek: all approved this week + all pending
        var nonEmpty = true;

        if ( sh.filter.start > days || sh.filter.end < days )
        {
          continue;
        }

        if ( sh.billingWeek === true ) {
          if ( sh.isBillWeek( data ) !== true ) {
            continue;
          }
        }

        if ( sh.filter.region_ky !== '1' ) {
          if ( data.region_ky.toString( ) !== sh.filter.region_ky ) {
            continue;
          }
        }

        if ( sh.filter.approved !== 'all' ) {
          if ( data.approved !== sh.filter.approved ) {
            continue;
          }
        }

        if ( sh.filter.new_record !== 'all' ) {
          if ( sh.filter.new_record !== data.new_record ) {
              continue;
            }
        }

        for ( var key in sh.filter.checkempty ) {
          if ( sh.filter.checkempty[key] !== '' ) {
            if ( data[key].toLowerCase( ).indexOf( sh.filter.checkempty[key].toLowerCase( ) ) === -1 ) {
              nonEmpty = false;
              break;
            }
          }
        }

        if ( nonEmpty === false ) {
          continue;
        }

      // Apply FIlter Ends

      i ++;
      rowCount ++;

      dataHtml += '<tr class="rValue" id="' + data.id + '">'
      currentPKeyList.push( data.pkey );

      for ( var j = 0; j < sh.fields.length; j++ ) {
        var item = sh.fields[j],
          classL = '',
          key = item.key,
          dd = data[key],
          yesC = '';

        if ( item.link === true ) {
          if ( key === 'pkey' ) {
            if ( sh.filter.presetFilter === 'edit' ) {
              classL = ' class="linkC editLink" ';
            }
            else {
              classL = ' class="linkC deleteLink" ';
            }
          }
        }

        if ( key === 'approved' && data[key] === 'no' ) {
          bred = true;

          if ( item.link === true ) {
            classL = ' class="linkC bred approvalLink" ';
          }
          else {
            classL = ' class="bred" ';
          }
        }

        if ( bred === true && key === 'note' ) {
          classL = ' class="bred" ';
        }

        if ( key === 'pkey' && sh.filter.presetFilter === 'edit' ) {
          ; // display
        }
        else if ( key === 'billingweek_cutofftime' && sh.filter.presetFilter === 'nextweek' ) {
          ; // display
        }
        else if ( item.display === false && sh.filter.presetFilter !== 'showall' ) {
            continue;
        }

        if ( sh.filter.presetFilter === 'edit' ) {
          if ( key === 'start_time' ) {
            classL = ' class="e_s" ';
          }
          else if ( key === 'end_time' ) {
            classL = ' class="e_e" ';
          }
          else if ( key === 'break_time' ) {
            classL = ' class="e_b" ';
          }
          else if ( key === 'total_hours' ) {
            classL = ' class="e_t" ';
          }

          dd = '<div class="textValue">' + dd + '</div>'; 
        }

        if ( key === 'note' ) {
          if ( bred === true ) {
            classL = ' class="data_note bred" ';
          }
          else {
            classL = ' class="data_note" ';
          }
        }

        dataHtml += '<td' + classL + '>' + dd + '</td>';
      }

      dataHtml += '</tr>'
    }

    sh.rowCount = rowCount;
    sh.currentPKeyList = currentPKeyList;

    return dataHtml;
  },

  checkInOutTime: function( fieldVal, fieldObj )
  {
    var tvalue = fieldVal.trim();

    if ( tvalue !== fieldVal ) {
      fieldObj.val( tvalue );
    }

    var tstr = tvalue.substr( 0, tvalue.length - 2 ),
        hasC = tvalue.indexOf( ':' ),
        splitA = tvalue.split( ':' ),
        hours = sh.hours.indexOf( splitA[0] ),
        minute1 = hasC > 0 ? sh.minutes1.indexOf( tvalue[hasC + 1] ) : -2,
        minute2 = hasC > 0 ? sh.minutes2.indexOf( tvalue[hasC + 2] ) : -2;

    if ( hasC < 0 || hours < 0 || minute1 < 0 || minute2 < 0 ) {
      fieldObj.removeClass( 'bluefont' ).addClass( 'errorfont' );
      alert( 'Please enter a time format of "H:MM" or "HH:MM"' );

      return false;
    }

    fieldObj.removeClass( 'errorfont' ).addClass( 'bluefont' );

    return true;
  },

  checkBreakTime: function( fieldVal, fieldObj )
  {
    var tvalue = fieldVal.trim();

    if ( tvalue !== fieldVal ) {
      fieldObj.val( tvalue );
    }

    var sl = tvalue.length,
        hasC = tvalue.indexOf( ':' ),
        hour1 = ( sl === 5 && hasC === 2 ) ? sh.hour1.indexOf( tvalue[0] ) : -2,
        hour2 = ( sl === 5 && hasC === 2 ) ? sh.hour2.indexOf( tvalue[1] ) : -2,
        minute1 = ( sl === 5 && hasC === 2 ) ? sh.minutes1.indexOf( tvalue[3] ) : -2,
        minute2 = ( sl === 5 && hasC === 2 ) ? sh.minutes2.indexOf( tvalue[4] ) : -2;

    if ( sl !== 5 || hasC !== 2 || hour1 < 0 || hour2 < 0 || minute1 < 0 || minute2 < 0 ) {
      fieldObj.removeClass( 'bluefont' ).addClass( 'errorfont' );
      alert( 'Please enter break format of "HH:MM" and should be less than 20 hours' );

      return false;
    }

    fieldObj.removeClass( 'errorfont' ).addClass( 'bluefont' );

    return true;
  },

  isBillWeek: function( data )
  {
    var adate = data.auth_date;

    if ( adate === null || adate.trim() === '' ) {
//console.log( 'Not Yet' );

      return true;
    }
    else {
//console.log( data );
      var region_ky = data.region_ky,
          rdata = sh.rData[region_ky],
          days = ds.mdyToDays( adate );

      if ( rdata.closed === false ) {
//console.log( rdata.cutoff_time + ' :vs: ' + adate + ' ' + data.auth_time + ' :vs: ' + data.updatedAt );
        return ds.compareTime( rdata.cutoff_time, adate + ' ' + data.auth_time );
      }
      else if ( days + sh.bwStart > 0 ) {
//console.log( 'No cutoff found: is billing week' );
        return true;
      }
      else {
//console.log( 'No cutoff found: is billing week' );
        return false;
      }
    }
  },

  filterFields: [
    { type: 'select', key: 'region_ky', id: 'regionListField', label: 'Region:' },
    { type: 'select', key: 'new_record', id: 'emailSentField', label: 'Email Sent:' },
    { type: 'select', key: 'approved', id: 'approveField', label: 'Hours Approval:' },
    { type: 'input', key: 'ic_fname', id: 'icFirstnameField', label: 'IC Firstname:' },
    { type: 'input', key: 'ic_lname', id: 'icLastnameField', label: 'IC Lastname:' },
    { type: 'input', key: 'parent', id: 'clientField', label: 'Parent:' },
    { type: 'input', key: 'department', id: 'departmentField', label: 'Department:' },
    { type: 'input', key: 'service_target', id: 'targetField', label: 'Service Target:' },
    { type: 'input', key: 'cl_email', id: 'clemailField', label: 'Client Email:' },
    { type: 'select', key: 'action_buttons', id: 'presetFilterField', label: 'Preset Filters for Action:' },
    { type: 'button', key: 'Send New Email', id: 'emailToNewField', label: 'Process All New Records:' },
    { type: 'button', key: 'Send New Demo', id: 'emailToNewDemoField', label: 'Process All New Records:' },
    { type: 'button', key: 'Resend Email', id: 'resendEmailField', label: 'Only For List Below:' },
    { type: 'holder', key: 'Push to Next Week', id: 'pushToNextField', label: 'Only For List Below:' },
  ],

  emailSentOption: { 
    all: 'all',
    yes: 'yes',
    no:  'no',
  },

  approveOption: {
    all: 'all',
    yes: 'yes',
    no:  'no',
    'not yet': 'not yet',
  },
  
  presetFilterOption: { 
    none: 'Preset Filter: None',
    default: 'Preset Filter: Back to Default',
    tonew: 'Preset Filter: Send New Email',
    tonewdemo: 'Preset Filter: Send New Demo Email',
    resend: 'Preset Filter: Resend Email',
    nextweek: 'Preset Filter: Push to Next Week',
    edit: 'Edit Time', //FZFZ
    showall: 'Display All',
  },

  fields: [
    { key: 'pkey', title: 'PKey', link: true, display: false },
    { key: 'client_ky', title: 'Client ID', link: false, display: false },
    { key: 'cregion', title: 'Region', link: false, display: false },
    { key: 'week_ending', title: 'Week Ending', link: false, display: false },
    { key: 'shift_date', title: 'Shift Date', link: false, display: true },
    { key: 'candidate_ky', title: 'IC ID', link: false, display: true },
    { key: 'ic_fname', title: 'IC Firstname', link: false, display: true },
    { key: 'ic_lname', title: 'IC Lastname', link: false, display: true },
    { key: 'parent', title: 'Parent', link: false, display: true },
    { key: 'department', title: 'Department', link: false, display: true },
    { key: 'service_target', title: 'Service Target', link: false, display: true },
    { key: 'start_time', title: 'Start Time', link: false, display: true },
    { key: 'end_time', title: 'Out Time', link: false, display: true },
    { key: 'break_time', title: 'Break', link: false, display: true },
    { key: 'total_hours', title: 'Hours', link: false, display: true },
    { key: 'approved', title: 'Hours Approval', link: true, display: true },
    { key: 'note', title: 'Disapproval Reason', link: false, display: true },
    { key: 'auth_name', title: 'Auth Name', link: false, display: true },
    { key: 'cl_email', title: 'Client Email', link: false, display: true },
    { key: 'auth_date', title: 'Auth Date', link: false, display: true },
    { key: 'auth_time', title: 'Auth Time', link: false, display: true },
    { key: 'new_record', title: 'Email Sent', link: false, display: false },
    { key: 'updatedAt', title: 'Update Time', link: false, display: false },
    { key: 'createdAt', title: 'Create Time', link: false, display: false },
    { key: 'billingweek_cutofftime', title: 'Billing Week', link: false, display: false },
  ],

  hour1: [ '0', '1' ],
  hour2: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
  hours: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ],
  minutes1: [ '0', '1', '2', '3', '4', '5' ],
  minutes2: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ],

};
