
// Shim deps
var _ = _ || shim( 'lodash' ),
    $ = $ || shim( 'jquery' );

// Export public API
var exports = function( opts ) {
    exports.setOptions( opts );
};

_.extend( exports, (function() {
    var options = {
        selfRegister: true,
        basePath: './'
    },

        cache = [];

    return {
        VERSION: '0.2.3-snapshot',

        setOptions: function( opts ) {
            _.extend( options, opts );

            return options;
        },

        getCachedItem: function( el ) {
            return _.find( cache, function( item ) {
                return item.id === el.dataset.src;
            });
        },

        injectCache: function( item ) {
            _.each( item.elements, function( el ) {
                this.injectSVG( el, item.content );
            }, this );
        },

        injectSVG: function( el, svg ) {
            $( el ).replaceWith( svg );

            // Fire an onload callback if one is specified
            if ( el.dataset.onload ) {
                var strip = el.dataset.onload.split( '.' ),
                    section = strip.shift(),
                    fn = window;
                while ( section ) {
                    if ( fn[ section ] ) {
                        fn = fn[ section ];
                    }
                    section = strip.shift();
                }
                if ( typeof fn === 'function' ) {
                    fn();
                }
            }
        },

        inject: function( force ) {
            if ( !options.selfRegister && !force ) {
                return;
            }

            var els = $( '.icon' );

            _.each( els, function( el ) {
                var self = this;

                // Bail
                if ( !el.dataset.src ) {
                    console.error( 'No URL specified for icon' );
                    return;
                }

                // Check the cache
                var cached = self.getCachedItem( el );

                if ( cached ) {
                    if ( cached.content ) {
                        this.injectSVG( el, cached.content );
                        return;
                    }

                    cached.elements.push( el );
                    return;
                }

                // Load the icon
                if ( !cached ) {
                    cache.push( {
                        id: el.dataset.src,
                        content: null,
                        elements: [ el ]
                    });
                }
                $.ajax( {
                    type: 'GET',
                    url: el.dataset.src.match( /^http/ ) ? el.dataset.src : join( options.basePath, el.dataset.src ),
                    dataType: 'text'
                })
                    .done( function( data, status, xhr) {
                        var cached = null;
                        iconClass = el.dataset.class || '';
                        res = data.replace( /\r?\n|\r/g, '' )
                                  .replace( /<svg/, '<svg class="' + iconClass + '" ')
                                  .match( /<svg(.*?)svg>/g )
                                  .toString();

                        cached = self.getCachedItem( el );
                        cached.content = res;
                        self.injectCache( cached );
                    })
                    .fail( function( xhr, status, err ) {
                        console.log( 'xhr failed', status, err );
                        console.log( 'Error loading icon', err );
                    });

            }, this );
        }
    };
})() );

// Self running module
document.addEventListener( 'DOMContentLoaded', function( event ) {
    exports.inject();
});
