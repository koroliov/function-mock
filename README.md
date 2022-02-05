# function-mock

### Intro

The intention of this module is to simplify mock functions in unit tests.

Sometimes it's not required or even detrimental to use tools, which allow calls
counting, arguments recording etc. If you don't need all that functionality you
may use an approach similar to this one: just define a behavior for a function,
when it's called with particular arguments.

    const functionMock = require('function-mock');
    const fm = functionMock()
      .with('foo').returns('1')
      .with('bar').returns('2')
      .withOther().throws('Some error message');
    //returns '1'
    fm('foo');
    //returns '2'
    fm('bar');
    //throws
    fm('bar', true);

### Documentation v2.0.\*

The imported module is a function, which when called returns a mock function.
On itself it's not much useful.

    const functionMock = require('function-mock');
    const mocked = functionMock();

    //returns undefined
    mocked();

#### `mocked` function's methods

This function has several methods:

- `.with(arg1?, arg2? …)` Accepts arguments which later will be matched against
  arguments provided to the `mocked(arg1?, arg2? …)` calls.

- `.withNew(arg1?, arg2? …)` The same as the `.with()` method, except that
  arguments will be matched only if the `mocked` function is called with the
  `new` operator: `new mocked(arg1?, arg2 …)`

- `.withOther()` Used to provide a return or throw value for ordinary calls
  (without the new operator) where the arguments don't match any of the
  arguments previously provided with the `.with()` or `.withNew()` calls the
  `mocked(arg1?, arg2?  …)` calls.

      const functionMock = require('function-mock');
      let mocked = functionMock()
        .with(1).returns(2)
        .withOther().returns(0);
      //returns 0
      mocked('not mathing value');
      //returns 0
      mocked();

      mocked = functionMock()
        .with(1).returns(2)
        .withOther().throws('Some error message');
      //throws 0
      mocked();
      //etc.

  This method is supposed to be one of the last ones in the call chain. After
  it's called only the `.withOtherNew()` method will be available on the value
  returned from the `.returns()` or `.throws()` call.

        const mocked = functionMock()
          .with(1).returns(2)
          .withOther().returns(0);
          // this will throw, since no .with or .withNew methods available at
          //this point
          .with()
          .returns(1);

- `.withOtherNew()`
  The same as the `.withOther()` method, except that will return/throw a
  value/error with a message provided to the subsequent `.returns()` or
  `.throws()` call only if the mock function has been called with the `new`
  operator.

- `.returns(value)` This method is intended to be called after a `.with()` or
  similar method call: `.with(…).returns(…)`. Makes the mocked function return
  the provided value if the arguments to its call match, (if called after
  `.withNew()` then the value must be an object (not a primitive)):

      const functionMock = require('function-mock');
      const mocked = functionMock().with(1).returns(2);
      //returns 2
      mocked(1);

      const notPrimitive = [];
      mocked.withNew(1).returns(notPrimitive);
      //returns notPrimitive
      new mocked(1);

- `.throws(message)` analogous to `.returns()` but throws `new Error(message)`.

#### Call behavior with unmatched arguments

- without the `new` operator, when the `.withOther()` method hasn't been called:

  the mock function returns `undefined` if it's called with arguments which
  haven't matched arguments from any previous `.with()` call:

      const mocked = functionMock()
        .with(1).returns(2)
        .with(1, 2).returns(3);

      //returns undefined
      mocked(2, 1);

- without the `new` operator, when the `.withOther()` method has been called:

  the mock function returns a value provided to a subsequent
  `.returns()` call, or throws an error with a message, provided to a
  subsequent `.throws()` call

      const mocked = functionMock()
        .with(1).returns(2)
        .with(1, 2).returns(3)
        .withOther().returns('foo');

      //returns 'foo'
      mocked(2, 1);

- with the `new` operator, when the `.withOtherNew()` method hasn't been called:

  the mock function returns `undefined` if it's called with arguments which
  haven't matched arguments from any previous `.withNew()` call:

      const retValueOne = [];
      const retValueTwo = {};
      const mocked = functionMock()
        .withNew(1).returns(retValueOne)
        .withNew(1, 2).returns(retValueTwo);

      //returns {} (an instance of mocked)
      new mocked(2, 1);

- with the `new` operator, when the `.withOtherNew()` method has been called:

  the mock function returns/throws a value/error with a message provided to the
  subsequent `.returns()` / `.throws()` call:

      const retValueOne = [];
      const retValueTwo = {};
      const retValueDefault = {};
      const mocked = functionMock()
        .withNew(1).returns(retValueOne)
        .withNew(1, 2).returns(retValueTwo)
        .withOtherNew().returns(retValueDefault);

      //returns retValueDefault
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
