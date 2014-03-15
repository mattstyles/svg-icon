
function shim( dep ) {
    var Arrayproto = Array.prototype;

    function jq() {
        var $ = function( selector ) {
            if ( typeof selector === 'object' ) {
                return $.extend( selector, $ );
            }

            var els = document.querySelectorAll( selector ),
                wrapped = [];

            Arrayproto.forEach.call( els, function( el ) {
                wrapped.push( $.extend( el, $ ) );
            });

            return wrapped;
        };

        $.extend = function( base ) {
            Arrayproto.forEach.call( Arrayproto.slice.call( arguments ), function( src ) {
                if ( src !== base ) {
                    for ( var prop in src ) {
                        if ( src.hasOwnProperty( prop ) ) {
                            base[ prop ] = src[ prop ];
                        }
                    }
                }
            } );

            return base;
        };

        $.replaceWith = function( newElement ) {
            var el = newElement;

            if ( typeof newElement === 'string' ) {
                el = document.createElement( 'div' );
                el.innerHTML = newElement;
                el = el.firstChild;
            }

            this.parentElement.replaceChild( el, this );
        };

        $.ajax = function( opts ) {
            opts = $.extend( {
                type: 'GET',
                url: ''
            }, opts );

            var promise = {
                done: function( cb ) {
                    this.done = cb;
                    return this;
                },
                fail: function( cb ) {
                    this.fail = cb;
                    return this;
                }
            };

            var req = new XMLHttpRequest();
            req.open( opts.type, opts.url, true );
            req.onload = function() {
                if ( req.status === 200 ) {
                    promise.done( req.response, req.status, req );
                    return;
                }

                promise.fail();
            };
            req.onerror = function( err ) {
                promise.fail( req, req.status, err );
            };
            req.send();

            return promise;
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
                    if ( src !== base ) {
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
                var index = -1,
                    len = collection.length;

                while( ( index = index + 1 ) < len ) {
                    if ( cb.call( null, collection[ index ] ) === true ) {
                        return collection[ index ];
                    }
                }

                return null;
            }
        };
    }

    var shims = {
        jquery: jq,
        lodash: lodash,
        'default': function() {
            console.log( 'Specified dependency for svg-icon not handled' );
        }
    };

    if ( shims[ dep ] ) {
        return shims[ dep ]();
    } else {
        return shims[ 'default' ]();
    }
}
