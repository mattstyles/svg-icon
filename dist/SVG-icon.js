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
     * SVG-icon - v0.2.0
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
                    this.each( collection, function( el ) {
                        if ( cb( el ) === true ) {
                            return el;
                        }
                    });
    
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
