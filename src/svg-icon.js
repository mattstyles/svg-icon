
// @todo add shims for dependencies
var _ = _ || shim( 'lodash' ),
    $ = $ || shim( 'jquery' );


var path = './',
    req = null,
    cache = [];

// Export public API
var exports = function( opts ) {
    exports.setOptions( opts );
};

_.extend( exports, (function() {
    var options = {
        selfRegister: true
    };

    return {
        VERSION: '0.1.0',

        setOptions: function( opts ) {
            _.extend( options, opts );
        },

        injectSVG: function( el, svg ) {
            el.outerHTML = svg;
        },

        inject: function() {
            if ( !options.selfRegister ) {
                return;
            }

            console.log( 'SVGIcon self registered' );

            var els = document.querySelectorAll( '.icon' );

            _.each( els, _.bind( function( el ) {
                // Bail
                if ( !el.dataset.src ) {
                    console.error( 'No URL specified for icon' );
                    return;
                }

                // Check the cache
                var cached = _.find( cache, function( item ) {
                    return item.id === el.dataset.src;
                });

                if ( cached ) {
                    console.log( 'loading icon from cache' );
                    this.injectSVG( el, cached.content );
                    return;
                }

                // Load the icon
                this.ajax( el, this.injectSVG );
            }, this ) );
        },

        ajax: function( el, cb ) {
            var res = '';

            console.log( 'loading new icon' );

            req = new XMLHttpRequest();
            req.open( 'GET', path + el.dataset.src, false );    // Do a dirty synchronous get
            req.onload = function() {
                if ( req.status === 200 ) {
                    iconClass = el.dataset.class || '';
                    res = req.response.replace( /\r?\n|\r/g, '' )
                                      .replace( /<svg/, '<svg class="' + iconClass + '" ')
                                      .match( /<svg(.*?)svg>/g );

                    cache.push( {
                        id: el.dataset.src,
                        content: res
                    });

                    cb( el, res );
                }
            };
            req.onerror = function( err ) {
                console.error( 'Error loading icon ' );
                console.error( err );
            };
            req.send();
        }
    };
})() );



// Self running module
document.addEventListener( 'DOMContentLoaded', function( event ) {
    exports.inject();
});
