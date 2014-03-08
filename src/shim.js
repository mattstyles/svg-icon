

function shim( dep ) {
    var Arrayproto = Array.prototype;

    function jq() {
        var $ = function( selector ) {

        };

        $.ajax = function( args ) {

        };

        return $;
    }

    function lodash() {
        return {
            each: function( collection, cb, ctx) {
                if ( Arrayproto.forEach ) {
                    return Arrayproto.forEach.call( collection, cb, ctx );
                }

                var index = -1,
                    len = collection.length;

                while( ( index = index + 1 ) < len ) {
                    if ( cb.call( ctx || null, collection[ index ] ) === false ) {
                        break;
                    }
                }
            },

            extend: function( base ) {
                this.each( Arrayproto.slice.call( arguments ), function( src ) {
                    if ( src ) {
                        for ( var prop in src ) {
                            if ( src.hasOwnProperty( prop ) ) {
                                base[ prop ] = src[ prop ];
                            }
                        }
                    }
                } );

                return base;
            },

            find: function( collection, cb ) {
                this.each( collection, function( el ) {
                    if ( cb( el ) === true ) {
                        return el;
                    }
                });

                return null;
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
