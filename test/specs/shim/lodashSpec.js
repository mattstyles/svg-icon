
describe( 'lodash shim tests -', function() {

    beforeEach( function() {

    });

    afterEach( function() {

    });


    describe( '_ existence', function() {
        it( 'expects _ to be defined', function() {
            expect( _ ).toBeDefined();
        });
    });

    describe( '_.each', function() {
        var testArray = [],
            array = [1,2,3],
            expected = [2,4,6],
            obj = {
                fn: function() {}
            };

        beforeEach( function() {
            _.each( array, function( num ) {
                testArray.push( num * 2 );
            });
        });

        afterEach( function() {
            testArray = [];
        });

        it( 'expects to be able to iterate through an array', function() {
            expect( utils.testObjectEquality( testArray, expected ) ).toBeTruthy();
        });

        it( 'expects an iterator function to have been called for each item in the array', function() {
            spyOn( obj, 'fn' );

            _.each( array, obj.fn );

            expect( obj.fn.calls.count() ).toBe( 3 );
        });

        it( 'expects to be able to specify the context of the iterator', function() {
            var ctx = null;

            _.each( array, function() {
                ctx = this;
            }, obj );

            expect( ctx ).toEqual( obj );
        });
    });

    describe( '_.extend -', function() {
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
            expect( typeof _.extend ).toBe( 'function' );
        });

        it( 'expects an object returned from extend to be the amalgam of the objects passed to extend', function() {
            expect( utils.testObjectEquality( _.extend( foo, bar ), expected ) ).toBeTruthy();
        });

        it( 'expects the object specified as a first parameter to be extended', function() {
            _.extend( foo, bar )

            expect( utils.testObjectEquality( foo, expected ) ).toBeTruthy();
        });
    });

    describe( '_.find -', function() {
        var array = [1,2,3];

        it( 'expects to return a matched item', function() {
            expect( _.find( array, function( item ) {
                return item === 2;
            }) ).toBe( 2 );
        });

        it( 'expects to return null if the item is not matched', function() {
            expect( _.find( array, function( item ) {
                return item === 4;
            }) ).toBe( null );
        });
    });

});
