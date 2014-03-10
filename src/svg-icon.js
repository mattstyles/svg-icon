
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
        VERSION: '0.2.0',

        setOptions: function( opts ) {
            _.extend( options, opts );
        },

        injectSVG: function( el, svg ) {
            $( el ).replaceWith( svg );
        },

        inject: function() {
            if ( !options.selfRegister ) {
                return;
            }

            console.log( 'SVGIcon self registered' );

            var els = $( '.icon' );

            _.each( els, function( el ) {
                var self = this;

                // Bail
                if ( !el.dataset.src ) {
                    console.error( 'No URL specified for icon' );
                    return;
                }

                // Check the cache
                // @todo grabbing the svg's is now async so this will invariably be incorrect
                // as the cache wont have been populated before the next request comes in
                var cached = _.find( cache, function( item ) {
                    return item.id === el.dataset.src;
                });

                if ( cached ) {
                    console.log( 'loading icon from cache' );
                    this.injectSVG( el, cached.content );
                    return;
                }

                // Load the icon
                $.ajax( {
                    type: 'GET',
                    url: el.dataset.src.match( /^http/ ) ? el.dataset.src : join( options.basePath, el.dataset.src ),
                    dataType: 'text'
                })
                    .done( function( data, status, xhr) {
                        iconClass = el.dataset.class || '';
                        res = data.replace( /\r?\n|\r/g, '' )
                                  .replace( /<svg/, '<svg class="' + iconClass + '" ')
                                  .match( /<svg(.*?)svg>/g )
                                  .toString();

                        cache.push( {
                            id: el.dataset.src,
                            content: res
                        });

                        self.injectSVG( el, res );
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
