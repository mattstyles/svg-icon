!function( root ) {
    var oldAnchor = null,
        iframe = document.getElementById( 'view' ),
        nav = document.querySelector( 'nav' );

    // Quick dirty path normalizer
    function join() {
        var paths = Array.prototype.slice.call( arguments ),
            joined = paths.join( '\\' );

        return joined.replace( /\\\//g, '/' )
                     .replace( /\/\\/g, '/' )
                     .replace( /\/\//g, '/' )
                     .replace( /\\/g, '/' );
    }

    // Listens for a hash change
    function hashChange() {
        var href = window.location.hash,
            loc = href,
            anchor = document.querySelector( 'a[href="' + href +'"]' );

        if ( oldAnchor ) {
            oldAnchor.classList.remove( 'active' );
            anchor.classList.add( 'active' );
        }

        oldAnchor = anchor;

        if ( href ) {
            iframe.src = href.replace( /^#/, '' )
                             .replace( /$/, '.html' ) ;
        }
    }


    // Append listener
    window.addEventListener( 'hashchange', hashChange );

    // Strip any current hash
    window.location.hash = '';
}( this );


