var utils = {

    createElement: function( elementType, attributes, content ) {
        var el = document.createElement( elementType );
        for ( key in attributes ) {
            el.setAttribute( key, attributes[ key ] );
        }
        if ( content ) {
            el.innerHTML = content;
        }
        return el;
    },

    testObjectEquality: function( obj, obj1 ) {
        var flag = true;

        for( key in obj ) {
            if ( obj[ key ].toString() !== obj1[ key ].toString() ) {
                flag = false;
            }
        }
        for( key in obj1 ) {
            if ( obj1[ key ].toString() !== obj[ key ].toString() ) {
                flag = false;
            }
        }

        return flag;
    }
}
