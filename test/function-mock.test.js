'use strict';

const tp = require('tape');
const functionMock = require('../src/function-mock.js');

//==============================================================================
//arguments matching for the .with() method
//==============================================================================

tp(`no arguments`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock().with().returns(returnValue);
  t.equal(fm(), returnValue);

  t.notEqual(fm(undefined), returnValue);
  t.notEqual(fm(null), returnValue);
  t.notEqual(fm(0), returnValue);
  t.notEqual(fm(false), returnValue);

  t.end();
});

//  primitive values
tp(`primitive values, empty string`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock().with('').returns(returnValue);
  t.equal(fm(''), returnValue);

  t.notEqual(fm(), returnValue);
  t.notEqual(fm(undefined), returnValue);
  t.notEqual(fm(null), returnValue);
  t.notEqual(fm(0), returnValue);
  t.notEqual(fm(false), returnValue);

  t.end();
});

tp(`primitive values, not empty string`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock().with('foo').returns(returnValue);
  t.equal(fm('foo'), returnValue);

  t.notEqual(fm('fooo'), returnValue);
  t.notEqual(fm(1), returnValue);
  t.notEqual(fm(true), returnValue);

  t.end();
});

tp(`primitive values, 0`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock().with(0).returns(returnValue);
  t.equal(fm(0), returnValue);

  t.notEqual(fm(1), returnValue);
  t.notEqual(fm(undefined), returnValue);
  t.notEqual(fm(null), returnValue);
  t.notEqual(fm(false), returnValue);

  t.end();
});

tp(`primitive values, not 0`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock().with(1).returns(returnValue);
  t.equal(fm(1), returnValue);

  t.notEqual(fm(0), returnValue);
  t.notEqual(fm(true), returnValue);

  t.end();
});

tp(`primitive values, undefined`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock().with(undefined).returns(returnValue);
  t.equal(fm(undefined), returnValue);

  t.notEqual(fm(), returnValue);
  t.notEqual(fm(0), returnValue);
  t.notEqual(fm(''), returnValue);
  t.notEqual(fm(null), returnValue);
  t.notEqual(fm(false), returnValue);

  t.end();
});

tp(`primitive values, null`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock().with(null).returns(returnValue);
  t.equal(fm(null), returnValue);

  t.notEqual(fm(undefined), returnValue);
  t.notEqual(fm(0), returnValue);
  t.notEqual(fm(''), returnValue);
  t.notEqual(fm(false), returnValue);

  t.end();
});

tp(`primitive values, false`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock().with(false).returns(returnValue);
  t.equal(fm(false), returnValue);

  t.notEqual(fm(undefined), returnValue);
  t.notEqual(fm(null), returnValue);
  t.notEqual(fm(0), returnValue);
  t.notEqual(fm(''), returnValue);
  t.notEqual(fm(true), returnValue);

  t.end();
});

tp(`primitive values, true`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock().with(true).returns(returnValue);
  t.equal(fm(true), returnValue);

  t.notEqual(fm('not empty'), returnValue);
  t.notEqual(fm(1), returnValue);
  t.notEqual(fm(false), returnValue);

  t.end();
});

//  ref values
tp(`ref values, loosely compared, primitives inside compared strictly`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock()
    .with([1, true, null, undefined]).returns(returnValue);
  t.equal(fm([1, true, null, undefined]), returnValue);

  t.notEqual(fm([0, true, null, undefined,]), returnValue);
  t.notEqual(fm([1, true, null, ,]), returnValue);

  t.end();
});

tp(`comparison rules for primitives and ref values are recursive`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock()
    .with([1, [2], null, undefined]).returns(returnValue);
  t.equal(fm([1, [2], null, undefined]), returnValue);

  t.notEqual(fm([1, [], null, undefined,]), returnValue);

  t.end();
});

tp(`prototype chains are compared`, t => {
  const returnValue = Symbol('Return value');
  class Parent {
    constructor() {}
  }
  class Child extends Parent {
    constructor() {
      super();
    }
  }
  class GrandChild extends Child {
    constructor() {
      super();
    }
  }
  const child = new Child();
  const fm = functionMock().with(child).returns(returnValue);
  t.equal(fm(child), returnValue);

  const grandChild = new GrandChild();
  t.notEqual(fm(grandChild), returnValue);
  t.notEqual(fm({}), returnValue);

  t.end();
});

//  argument order
tp(`argument order matters`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock()
    .with(1, 2).returns(returnValue);
  t.equal(fm(1, 2), returnValue);

  t.notEqual(fm(2, 1), returnValue);
  t.notEqual(fm(1, 1, 2), returnValue);
  t.notEqual(fm(1, 2, 2), returnValue);

  t.end();
});

//  argument amount
tp(`argument amount matters`, t => {
  const returnValue = Symbol('Return value');
  const fm = functionMock()
    .with(1, 2).returns(returnValue);
  t.equal(fm(1, 2), returnValue);

  t.notEqual(fm(1), returnValue);
  t.notEqual(fm(1, 2, 3), returnValue);

  t.end();
});

//==============================================================================
//arguments matching for the .withNew() method
//==============================================================================

tp(`no arguments`, t => {
  const returnValue = {};
  const fm = functionMock().withNew().returns(returnValue);
  t.equal(new fm(), returnValue);

  t.notEqual(new fm(undefined), returnValue);
  t.notEqual(new fm(null), returnValue);
  t.notEqual(new fm(0), returnValue);
  t.notEqual(new fm(false), returnValue);

  t.end();
});

//  primitive values
tp(`primitive values, empty string`, t => {
  const returnValue = {};
  const fm = functionMock().withNew('').returns(returnValue);
  t.equal(new fm(''), returnValue);

  t.notEqual(new fm(), returnValue);
  t.notEqual(new fm(undefined), returnValue);
  t.notEqual(new fm(null), returnValue);
  t.notEqual(new fm(0), returnValue);
  t.notEqual(new fm(false), returnValue);

  t.end();
});

tp(`primitive values, not empty string`, t => {
  const returnValue = {};
  const fm = functionMock().withNew('foo').returns(returnValue);
  t.equal(new fm('foo'), returnValue);

  t.notEqual(new fm('fooo'), returnValue);
  t.notEqual(new fm(1), returnValue);
  t.notEqual(new fm(true), returnValue);

  t.end();
});

tp(`primitive values, 0`, t => {
  const returnValue = {};
  const fm = functionMock().withNew(0).returns(returnValue);
  t.equal(new fm(0), returnValue);

  t.notEqual(new fm(1), returnValue);
  t.notEqual(new fm(undefined), returnValue);
  t.notEqual(new fm(null), returnValue);
  t.notEqual(new fm(false), returnValue);

  t.end();
});

tp(`primitive values, not 0`, t => {
  const returnValue = {};
  const fm = functionMock().withNew(1).returns(returnValue);
  t.equal(new fm(1), returnValue);

  t.notEqual(new fm(0), returnValue);
  t.notEqual(new fm(true), returnValue);

  t.end();
});

tp(`primitive values, undefined`, t => {
  const returnValue = {};
  const fm = functionMock().withNew(undefined).returns(returnValue);
  t.equal(new fm(undefined), returnValue);

  t.notEqual(new fm(), returnValue);
  t.notEqual(new fm(0), returnValue);
  t.notEqual(new fm(''), returnValue);
  t.notEqual(new fm(null), returnValue);
  t.notEqual(new fm(false), returnValue);

  t.end();
});

tp(`primitive values, null`, t => {
  const returnValue = {};
  const fm = functionMock().withNew(null).returns(returnValue);
  t.equal(new fm(null), returnValue);

  t.notEqual(new fm(undefined), returnValue);
  t.notEqual(new fm(0), returnValue);
  t.notEqual(new fm(''), returnValue);
  t.notEqual(new fm(false), returnValue);

  t.end();
});

tp(`primitive values, false`, t => {
  const returnValue = {};
  const fm = functionMock().withNew(false).returns(returnValue);
  t.equal(new fm(false), returnValue);

  t.notEqual(new fm(undefined), returnValue);
  t.notEqual(new fm(null), returnValue);
  t.notEqual(new fm(0), returnValue);
  t.notEqual(new fm(''), returnValue);
  t.notEqual(new fm(true), returnValue);

  t.end();
});

tp(`primitive values, true`, t => {
  const returnValue = {};
  const fm = functionMock().withNew(true).returns(returnValue);
  t.equal(new fm(true), returnValue);

  t.notEqual(new fm('not empty'), returnValue);
  t.notEqual(new fm(1), returnValue);
  t.notEqual(new fm(false), returnValue);

  t.end();
});

//  ref values
tp(`ref values, loosely compared, primitives inside compared strictly`, t => {
  const returnValue = {};
  const fm = functionMock()
    .withNew([1, true, null, undefined]).returns(returnValue);
  t.equal(new fm([1, true, null, undefined]), returnValue);

  t.notEqual(new fm([0, true, null, undefined,]), returnValue);
  t.notEqual(new fm([1, true, null, ,]), returnValue);

  t.end();
});

tp(`comparison rules for primitives and ref values are recursive`, t => {
  const returnValue = {};
  const fm = functionMock()
    .withNew([1, [2], null, undefined]).returns(returnValue);
  t.equal(new fm([1, [2], null, undefined]), returnValue);

  t.notEqual(new fm([1, [], null, undefined,]), returnValue);

  t.end();
});

tp(`prototype chains are compared`, t => {
  const returnValue = {};
  class Parent {
    constructor() {}
  }
  class Child extends Parent {
    constructor() {
      super();
    }
  }
  class GrandChild extends Child {
    constructor() {
      super();
    }
  }
  const child = new Child();
  const fm = functionMock().withNew(child).returns(returnValue);
  t.equal(new fm(child), returnValue);

  const grandChild = new GrandChild();
  t.notEqual(new fm(grandChild), returnValue);
  t.notEqual(new fm({}), returnValue);

  t.end();
});

//  argument order
tp(`argument order matters`, t => {
  const returnValue = {};
  const fm = functionMock()
    .withNew(1, 2).returns(returnValue);
  t.equal(new fm(1, 2), returnValue);

  t.notEqual(new fm(2, 1), returnValue);
  t.notEqual(new fm(1, 1, 2), returnValue);
  t.notEqual(new fm(1, 2, 2), returnValue);

  t.end();
});

//  argument amount
tp(`argument amount matters`, t => {
  const returnValue = {};
  const fm = functionMock()
    .withNew(1, 2).returns(returnValue);
  t.equal(new fm(1, 2), returnValue);

  t.notEqual(new fm(1), returnValue);
  t.notEqual(new fm(1, 2, 3), returnValue);

  t.end();
});

//==============================================================================
//chaining behavior
//==============================================================================

tp(`matches arguments only the first with/withNew call`, t => {
  const primitiveValueOne = Symbol('Return value 1');
  const primitiveValueTwo = Symbol('Return value 2');
  let fm = functionMock()
    .with(1).returns(primitiveValueOne)
    .with(1).returns(primitiveValueTwo);
  t.equal(fm(1), primitiveValueOne);

  fm = functionMock()
    .with(1).returns(primitiveValueOne)
    .with(1).throws(primitiveValueTwo);
  t.equal(fm(1), primitiveValueOne);

  const refValueOne = {};
  const refValueTwo = {};
  fm = functionMock()
    .withNew(1).returns(refValueOne)
    .withNew(1).returns(refValueTwo);
  t.equal(new fm(1), refValueOne);

  fm = functionMock()
    .withNew(1).returns(refValueOne)
    .withNew(1).throws(refValueTwo);
  t.equal(new fm(1), refValueOne);

  fm = functionMock()
    .withNew(1).throws(refValueOne)
    .withNew(1).returns(refValueTwo);
  t.throws(() => { new fm(1); }, refValueOne);

  t.end();
});

tp(`with/withNew arguments are not confused`, t => {
  const primitiveValueOne = Symbol('Return value 1');
  const refValue = {};
  let fm = functionMock()
    .with(1).returns(primitiveValueOne)
    .withNew(1).returns(refValue);
  t.equal(fm(1), primitiveValueOne);
  t.equal(new fm(1), refValue);

  const primitiveValueTwo = Symbol('Return value 2');
  fm = functionMock()
    .with(1).throws(primitiveValueOne)
    .withNew(1).throws(primitiveValueTwo);
  t.throws(() => { fm(1); }, primitiveValueOne);
  t.throws(() => { new fm(1); }, primitiveValueTwo);

  t.end();
});

//==============================================================================
//call behavior with unmatched arguments
//==============================================================================

tp(`returns undefined/{} if no .with()/.withNew() arguments match`, t => {
  let fm = functionMock()
    .with(1).returns(2)
    .withNew(1).returns({foo: 'bar'});

  t.equal(fm(2), undefined);

  const retValWithNew = new fm(2);
  t.ok(retValWithNew instanceof fm);
  t.equal(Object.getOwnPropertyNames(retValWithNew).length, 0);

  t.end();
});
