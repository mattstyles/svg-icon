var utils = {

    createElement: function( elementType, attributes ) {
        var el = document.createElement( elementType );
        for ( key in attributes ) {
            el.setAttribute( key, attributes[ key ] );
        }
        return el;
    }
}
