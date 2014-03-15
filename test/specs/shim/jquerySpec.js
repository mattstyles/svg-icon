
describe( 'jquery shim test', function(){
    var div = utils.createElement( 'div', {
        id: 'foo',
        class: 'testClass'
    });

    var ul = utils.createElement( 'ul' );
    ul.innerHTML = '<li></li><li></li>';

    beforeEach( function() {
        document.body.appendChild( div );
        document.body.appendChild( ul );
    });

    afterEach( function() {

    });


    describe( '$ existence', function() {

        it( 'expects $ to be defined', function() {
            expect( $ ).toBeDefined();
        });
    });

    describe( '$ function', function() {

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
});
