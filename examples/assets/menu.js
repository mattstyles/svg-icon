
!function() {
    var open = false,
        menuStrip = document.querySelector( '.menu' ),
        menuBtn = null,
        container = document.querySelector( '.container' ),
        body = document.body,

    // Prefixing shamelessly borrowed from cubiq/iscroll
        elementStyle = document.createElement('div').style,

        vendor = (function () {
            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                transform,
                i = 0,
                l = vendors.length;

            for ( ; i < l; i++ ) {
                transform = vendors[i] + 'ransform';
                if ( transform in elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
            }

            return false;
        })();

    function prefixStyle (style) {
        if ( vendor === false ) return false;
        if ( vendor === '' ) return style;
        return vendor + style.charAt(0).toUpperCase() + style.substr(1);
    }

    function toggleMenu( event, flag ) {
        if ( open ) {
            open = false;
            body.classList.remove( 'open' );
            container.removeEventListener( 'mouseover', closeMenu );
            container.addEventListener( 'mouseover', onCloseEnd );
        } else {
            openMenu();
        }
    }

    function openMenu() {
        open = true;
        body.classList.add( 'open' );
        menuStrip.removeEventListener( 'mouseover', openMenu );
        container.addEventListener( prefixStyle( 'transitionEnd' ), onOpenEnd );
    }

    function closeMenu() {
        open = false;
        body.classList.remove( 'open' );
        container.removeEventListener( 'mouseover', closeMenu );
        container.addEventListener( prefixStyle( 'transitionEnd' ), onCloseEnd );
    }

    function onCloseEnd() {
        container.removeEventListener( prefixStyle( 'transitionEnd' ), onCloseEnd );
        container.removeEventListener( 'mouseover', onCloseEnd );
        menuStrip.addEventListener( 'mouseover', openMenu );
    }

    function onOpenEnd() {
        container.removeEventListener( prefixStyle( 'transitionEnd' ), onOpenEnd );
        container.addEventListener( 'mouseover', closeMenu );
    }

    menuStrip.addEventListener( 'mouseover', openMenu );

    if ( !this.svgmenu ) {
        svgmenu = {
            addTouchEvents: function() {
                menuBtn = document.querySelector( '.icon-menu' );
                menuBtn.addEventListener( 'click', toggleMenu );
                menuBtn.addEventListener( 'touchdown', toggleMenu );
            }
        }
    }
}();
