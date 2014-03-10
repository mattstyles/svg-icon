// Quick dirty path normalizer
function join() {
    var paths = Array.prototype.slice.call( arguments ),
        joined = paths.join( '\\' );

    return joined.replace( /\\\//g, '/' )
    .replace( /\/\\/g, '/' )
    .replace( /\/\//g, '/' )
    .replace( /\\/g, '/' );
}
