# function-mock

### Intro

The intention of this module is to simplify mock functions in unit tests.

    const functionMock = require('function-mock');
    const fm = functionMock().with('foo').returns('1').with('bar').returns('2');
    //returns '1'
    fm('foo');
    //returns '2'
    fm('bar');

### Documentation v1.0.0

The imported module is a function, which when called returns a mock function.
On itself it's not much useful.

    const functionMock = require('function-mock');
    const mocked = functionMock();

    //returns undefined
    mocked();

#### `mocked` function's methods

This function has several methods:

- `.with(arg1?, arg2? …)`
  - accepts arguments which later will be matched against arguments provided to
  the `mocked(arg1?, arg2? …)` calls.

- `.withNew(arg1?, arg2? …)`
  - the same as the `.with()` method, except that arguments will be matched only
  if the `mocked` function is called with the `new` operator:
  `new mocked(arg1?, arg2 …)`

- `.returns(value)` this method is intended to be called after a `.with()` or
similar method call: `.with(…).returns(…)`. Makes the mocked function return the
provided value if the arguments to its call match, (if called after
`.withNew()` then the value must be an object (not a primitive)):

      const functionMock = require('function-mock');
      const mocked = functionMock().with(1).returns(2);
      //returns 2
      mocked(1);

      const notPrimitive = [];
      mocked.withNew(1).returns(notPrimitive);
      //returns notPrimitive
      new mocked(1);

- `.throws(value)` analogous to `.returns()` but throws the value. May be any
value, not only a reference one, but generally should be an instance of `Error`

#### Call behavior with unmatched arguments

- without the `new` operator:

  - the mock function returns `undefined` if it's called with arguments which
haven't matched arguments from any previous `.with()` call:

        const mocked = functionMock()
          .with(1).returns(2)
          .with(1, 2).returns(3);

        //returns undefined
        mocked(2, 1);

- with the `new` operator:

  - the mock function returns `undefined` if it's called with arguments which
haven't matched arguments from any previous `.with()` call:


        const retValueOne = [];
        const retValueTwo = {};
        const mocked = functionMock()
          .withNew(1).returns(retValueOne)
          .withNew(1, 2).returns(retValueTwo);

        //returns {}
        new mocked(2, 1);

#### Arguments match rules
For all methods (`.with()` & `.withNew()`) the arguments matching rules are the
same (the only difference is that if a mocked function was called with or
without the `new` operator) its arguments won't ever match arguments provided
to the `.withNew()` / `.with()` methods respectively.

For instance:

    const mocked = functionMock().with(1).returns(2);
    //doesn't match, doesn't return 2
    new mocked(1);

    mocked.withNew(2).returns({});
    //doesn't match, doesn't return {}
    mocked(2);



- the argument order matters:


      const fm = functionMock().with(1, 2).returns(3);
      //doesn't match, doesn't return 3
      fm(2, 1);

- the amount of arguments matters:


      const fm = functionMock().with(1).returns(3);
      //doesn't match, doesn't return 3
      fm(1, 2);

- primitive values are compared strictly `===`

- reference values are compared deeply by their leaf nodes:


      const fm = functionMock().with([{foo: 'foo'}], 'bar').returns('match');
      //matches, returns 'match'
      fm([{foo: 'foo',}], 'bar');

- prototypes are counted, for instance:


      class A {
        constructor() {}
      }

      //new A() will virtually produce a {} (an empty object w/o any own
      //properties) but it won't match a litteral {}
      const fm = functionMock().with(new A()).returns('match');
      //doesn't match
      fm({});
      //matches, returns 'match'
      fm(new A());

### LICENSE

MIT
