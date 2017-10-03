/*
    ----------------------------------------------------------------------------
    The Development Standards website was down when I tried to use it,
    so please take that into consideration....Thanks!
    --------------------------------------------------------------------------
*/

$(document).ready(function() {

    /* Listen for changes to form;
        Each time, check to see if form is complete */
    $('#rail-fare input, #rail-fare select').on("change", function() {
        $('.rail-fare-output').html('');

        /*  allFields object is populated using user's form inputs   */
        var allFields = {};
        /* formValid serves as a validator for the entire form; it's default is true, but if
            any part is invalid - it's set to false */
        var formValid = true;

        /* Series of functions to check whether input text/number & radio fields are complete */
        function checkTextField( element ) {
            if ( element.val() ) {
                allFields[element.attr('name')] = element.val();
            }   else {
                    formValid = false;
            }
        }
        /* For the sake of time, I neglected to include a check for a WHOLE & POSITIVE NUMBER, which is what the number of
            'trips' should be.
            But this function could be modified to include a 2nd or 3rd argument, which when provided - checks to see if number  is
            also whole and/or positive as well; if not, form would be invalidated */
        function checkNumberField(element) {
            if (element.val() ) {
                allFields[element.attr('name')] = parseInt(element.val());
            }   else {
                    formValid = false;
            }
        }
        function checkRadio(element) {
            if (    $(element +':checked'   ) .length)  {
                allFields[  $(element).attr('name')  ] = $(element +':checked'   ).val();
            }   else {
                    formValid  = false;
            }
        }
        // Zone
        checkNumberField(     $('#rail-fare-zone')    );
        // When
        checkTextField(     $('#rail-fare-when')    );
        // Where
        checkRadio( 'input[name=purchase]');
        // How Many
        checkNumberField(     $('#rail-fare-trips')    );

        /* If form is valid, getJSON data
            Normally, you'd also want to provide some type of error message if the request fails */
        if (formValid) {
            $.ajax({
                dataType: "json",
                url: 'fares.json',
                success: getPrice
            });
        }
        /* Run on successful request  */
        function getPrice(data) {
            var faresArray;
            /* First, check for a zone match & assign  that Zone to above  variable */
            $.each(data.zones, function(index, value) {
                if (value.zone === allFields.zone) {
                    faresArray = value.fares;
                }
            })
            /* Loop throgh Zone array to check for field matches */
            for (var i = 0; i < faresArray.length; i++) {
                /* Based on JSON, it appears 'anytime' is the only one with special volume rates
                    ----------------
                        I didn't know how to calculate the rate if someone selects 'anytime' but doesn't select 10,
                        so I simply leave the field blank until the user sets trips to 10; Typically, some type of instructive message should be provided and/or it  could
                        autoselect 10 fares
                    ----------------
                */
                if (   allFields.type === 'anytime'     ) {
                    if (    (faresArray[i].type === allFields.type) && (faresArray[i].purchase === allFields.purchase) && (faresArray[i].trips === allFields.trips) ) {
                        $('.rail-fare-output').html(   '$' + (faresArray[i].price).toFixed(2)     );
                        break;
                    }
                }
                /* If they don't select 'anytime,' check for noted matching fields and mutiply trips by price '*/
                else if (  (faresArray[i].type === allFields.type) && (faresArray[i].purchase === allFields.purchase)     ) {
                        $('.rail-fare-output').html(   '$' +  (allFields.trips * faresArray[i].price).toFixed(2)   );
                        console.log('else')
                        break;
                }
                else {
                        $('.rail-fare-output').html('');
                }
            }
        }
    })
})
