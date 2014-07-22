(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('lodash'), require('jquery'));
    }
    else if(typeof define === 'function' && define.amd) {
        define(['lodash', 'jquery'], factory);
    }
    else {
        root['SVGIcon'] = factory(root._, root.$);
    }
}(this, function(_, $) {

    /**
     * SVG-icon - v0.2.3
     * Copyright (c) 2014 Matt Styles
     * License MIT
     */
    
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
    
            $.data = function( attrName ) {
                return this.getAttribute( 'data-' + attrName );
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
                    return item.id === $( el ).data( 'src' );
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
                if ( $( el ).data( 'onload' ) ) {
                    var strip = $( el ).data( 'onload' ).split( '.' ),
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
                    if ( !$( el ).data( 'src' ) ) {
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
                            id: $( el ).data( 'src' ),
                            content: null,
                            elements: [ el ]
                        });
                    }
                    $.ajax( {
                        type: 'GET',
                        url: $( el ).data( 'src' ).match( /^http/ ) ? $( el ).data( 'src' ) : join( options.basePath, $( el ).data( 'src' ) ),
                        dataType: 'text'
                    })
                        .done( function( data, status, xhr) {
                            var cached = null;
                            iconClass = $( el ).data( 'class' ) || '';
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
    
    // Quick dirty path normalizer
    function join() {
        var paths = Array.prototype.slice.call( arguments ),
            joined = paths.join( '\\' );
    
        return joined.replace( /\\\//g, '/' )
                     .replace( /\/\\/g, '/' )
                     .replace( /\/\//g, '/' )
                     .replace( /\\/g, '/' );
    }
    

    return exports;

}));
