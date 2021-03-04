# mock-function

The original intention of this module is to simplify mock functions in unit
tests.

Instead of writing:

    function functionMock(val) {
      if (val === 'foo')
        return '1';
      }
      if (val === 'bar')
        return '2';
      }
    }

Which easily becomes too voluminous and cluttered, one should be able to write:

    const functionMock = require('mock-function');
    const fn = functionMock().with('foo').returns('1').with('bar').returns('2');

I created this for this rather simple purpose, so this module hasn't been
thoroughly tested etc. But the behavior I needed has been covered in the tests.

### Usage/Examples

`require('mock-function');` returns a function, which is supposed to be called
as a function, not a constructor. It returns another function, which allows its
return values to be set up thru `.with()` and `returns()`/`throws()` calls.

For behavior details see the tests in the test directory, though the behavior
should be rather intuitive.

Here, just a couple of examples:

    const functionMock = require('function-mock');
    const fm = functionMock()
      .with(1, 2, 3).returns('foo')
      .with([2, 1]).throws(new Error('Foo'));

    fm([2, 1]);             // will throw new Error('Foo')
    fm(1, 2, 3);            // will return 'foo'
    fm(anyOtherOrUndef);    // will return undefined

When the mock function is supposed to be called with the new operator, the user
must provide the return value to be some kind of object, i.e. an object, array
or something like that, not a primitive.  Since it's required by the ECMA
script spec. `return aPrimitive` will not work in a function called with `new`,
such a call will return its `this` value insted

    const functionMock = require('function-mock');
    const someObjectValue = [];
    const fm = functionMock()
      .withNew(1, 2, 3).returns(someObjectValue)

    new fm(1, 2, 3);            // will return someObjectValue
