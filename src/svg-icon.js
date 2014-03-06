
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
