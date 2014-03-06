

function shim( dep ) {

    function jq() {
        var $ = function( selector ) {

        };

        $.ajax = function( args ) {

        };

        return $;
    }

    function lodash() {
        return {
            find: function( args ) {

            }
        };
    }

    var delegate = {
        jquery: jq,
        lodash: lodash,
        'default': function() {
            console.log( 'Specified dependency for svg-icon not handled' );
        }
    };

    if ( dep ) {
        return delegate[ dep ]();
    }
}
