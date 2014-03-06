(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('lodash'), require('jquery'));
    }
    else if(typeof define === 'function' && define.amd) {
        define(['lodash', 'jquery'], factory);
    }
    else {
        root['SVGicon'] = factory(root._, root.$);
    }
}(this, function(_, $) {

    /**
     * SVG-icon - v0.0.1
     * Copyright (c) 2014 Matt Styles
     * License MIT
     */
    function shim() {
        console.log( '@todo add shims for dependencies' );
    }
    
    
    var privateVar = 'hello inject svg';
    
    // @todo add shims for dependencies
    //shim();
    
    
    function inject() {
        console.log(  'inject fn: ' + privateVar );
    }
    
    // Export public API
    var exports = {
        VERSION: '0.0.1',
        inject: inject
    };
    

    return exports;

}));
