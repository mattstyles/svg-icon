
describe( 'jquery shim tests -', function(){
    var div = utils.createElement( 'div', {
        id: 'foo',
        class: 'testClass'
    }, [
        '<ul>',
          '<li></li>',
          '<li></li>',
        '</ul>'
    ].join( '' ) );

    beforeEach( function() {
        document.body.appendChild( div );
    });

    afterEach( function() {
        document.body.removeChild( div );
    });


    describe( '$ existence', function() {

        it( 'expects $ to be defined', function() {
            expect( $ ).toBeDefined();
        });
    });

    describe( '$ -', function() {

        it( 'expects $ to be a function', function() {
            expect( typeof $ ).toBe( 'function' );
        });

        it( 'expects $ to be able to select elements', function() {
            expect( typeof $( 'body') === 'object' && typeof $( 'body' ).length === 'number' ).toBeTruthy();
            expect( $( 'body' ).length ).toBe( 1 );
            expect( $( '#foo' ).length ).toBe( 1 );
            expect( $( '.testClass' ).length ).toBe( 1 );
        });

        it( 'expects $ to be able to select multiple elements', function() {
            expect( $( 'li' ).length ).toBe( 2 );
        });

        it( 'expects that elements returned by $ are wrapped in the $ object', function() {
            expect( typeof $( 'body' )[0] ).toBe( 'object' );
            expect( $( 'body' )[0].extend ).toBeDefined();
        });

        it( 'expects that $ can be mixed in to a new object', function() {
            var obj = $( {
                foo: 'foo',
                bar: 'bar'
            });

            expect( typeof obj ).toBe( 'object' );
            expect( obj.foo ).toBeDefined();
            expect( obj.bar ).toBeDefined();
            expect( typeof obj.foo ).toBe( 'string' );
            expect( typeof obj.bar ).toBe( 'string' );
            expect( obj.extend ).toBeDefined();
        });
    });

    describe( '$.extend -', function() {
        var foo, bar,
            expected = {
                fn: function() {},
                f: 'f',
                b: 'b',
                a: 'a',
                r: 'r'
            };

        beforeEach( function() {

            foo = {
                fn: function() {},
                f: 'f'
            };
            bar = {
                b: 'b',
                a: 'a',
                r: 'r'
            };
        });

        afterEach( function() {
            foo = bar = null;
        });


        it( 'expects extend to be defined as a function', function() {
            expect( typeof $.extend ).toBe( 'function' );
        });

        it( 'expects an object returned from extend to be the amalgam of the objects passed to extend', function() {
            expect( utils.testObjectEquality( $.extend( foo, bar ), expected ) ).toBeTruthy();
        });

        it( 'expects the object specified as a first parameter to be extended', function() {
            $.extend( foo, bar )

            expect( utils.testObjectEquality( foo, expected ) ).toBeTruthy();
        });
    });

    describe( '$.replaceWith -', function() {
        var el, $el, replacer;

        beforeEach( function() {
            el = utils.createElement( 'div', {
                id: 'bar'
            });
            replacer = utils.createElement( 'div', {
                id: 'quux'
            });
            document.body.appendChild( el );
            $el = $( '#bar' )[ 0 ];
        });

        afterEach( function() {
            el = $el = replacer = null;
        });

        it( 'expects that a wrapped object is replaced with a new element', function() {
            $el.replaceWith( replacer );
            expect( $( '#quux' ).length ).toBe( 1 );
        });
    });

    describe( '$.ajax -', function() {
        it( 'expects ajax function to return a promise object', function() {
            var obj = $.ajax({ url: './base/test/fixtures/test.json' });

            expect( typeof obj ).toBe( 'object' );
            expect( obj.done ).toBeDefined();
            expect( obj.fail ).toBeDefined();
//            expect( obj.always ).toBeDefined();
        });

        // @todo add async testing
    });

});
