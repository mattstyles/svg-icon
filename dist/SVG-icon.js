(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else {
        factory();
    }
}(this, function() {

    /**
     * SVG-icon - v0.0.1
     * Copyright (c) 2014 Matt Styles
     * License MIT
     */
    'use strict';
    
    console.log( 'svg icon injector' );
    

}));
