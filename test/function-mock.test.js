'use strict';

const tp = require('tape');
const functionMock = require('../src/function-mock.js');

tp(`it returns the provided value on specific args,
  returns undefined if the arguments don't match`, t => {
  let mf = functionMock().with().returns(1);
  t.equal(mf(), 1);
  t.equal(mf('foo'), undefined);

  mf = functionMock().with('foo').returns(1);
  t.equal(mf('foo'), 1);
  t.equal(mf('bar'), undefined);

  mf = functionMock().with(['foo']).returns(1);
  t.equal(mf(['foo']), 1);
  t.equal(mf(['bar']), undefined);

  t.end();
});

tp(`supports chaining in any order, returns undefined if the arguments don't
  match`, t => {
  let mf = functionMock().with().returns(1).with('foo').returns(2);
  t.equal(mf('foo'), 2);
  t.equal(mf(), 1);

  mf = functionMock().with('foo').returns(1);
  t.equal(mf('foo'), 1);
  t.equal(mf('bar'), undefined);

  mf = functionMock().with(['foo']).returns(1);
  t.equal(mf(['foo']), 1);
  t.equal(mf(['bar']), undefined);

  t.end();
});

tp(`throws if the provided argumenst match`, t => {
  let mf = functionMock().with().throws(new Error('Foo'));
  t.throws(() => {
    mf();
  }, /Foo/);
  t.equal(mf('foo'), undefined);

  mf = functionMock().with(1).throws(new Error('Foo'));
  t.throws(() => {
    mf(1);
  }, /Foo/);
  t.equal(mf(2), undefined);

  t.end();
});

tp(`works with multiple arguments`, t => {
  let mf = functionMock().with(1, 2, 3).returns('foo');
  t.equal(mf(1, 2, 3), 'foo');
  t.equal(mf(1), undefined);

  mf = functionMock().with(1, 2, 3).throws(new Error('Foo'));
  t.throws(() => {
    mf(1, 2, 3);
  }, /Foo/);
  t.equal(mf(1, 2), undefined);

  t.end();
});

tp(`throws and returns word in chain`, t => {
  let mf = functionMock().with(1, 2, 3).returns('foo').with(3, 2, 1)
    .throws(new Error('Foo'));
  t.equal(mf(1, 2, 3), 'foo');
  t.throws(() => {
    mf(3, 2, 1);
  }, /Foo/);

  t.end();
});

tp(`doesn't confuse similar args`, t => {
  let mf = functionMock().with(1, 2, 3).returns('foo').with(1, 2)
    .throws(new Error('Foo'));
  t.equal(mf(1, 2, 3), 'foo');
  t.throws(() => {
    mf(1, 2);
  }, /Foo/);

  t.end();
});

tp(`it returns the provided object value on specific args,
  if it's been called with new, and doesn't return this value, if called
  with the same args but without new`, t => {
  const mockInstance = {};
  let mf = functionMock()
    .withNew().returns(mockInstance)
    .with().returns(1);
  t.equal(new mf(), mockInstance);
  t.equal(mf(), 1);

  mf = functionMock()
    .withNew('foo').returns(mockInstance)
    .with('foo').returns(1);
  t.equal(new mf('foo'), mockInstance);
  t.equal(mf('foo'), 1);

  mf = functionMock().withNew(['foo']).returns(mockInstance);
  t.equal(new mf(['foo']), mockInstance);
  t.equal(mf(['foo']), undefined);

  t.end();
});

tp(`it throws the provided value on specific args,
  if it's been called with new, and doesn't throw this value, if called
  with the same args but without new`, t => {
  const error = new Error('Foo');
  let mf = functionMock()
    .withNew().throws(error)
    .with().returns(1);
  t.throws(() => {
    new mf();
  }, /Foo/);
  t.doesNotThrow(() => {
    mf();
  });

  mf = functionMock()
    .withNew('foo').throws(error)
    .with('foo').returns(1);
  t.throws(() => {
    new mf('foo');
  }, /Foo/);
  t.doesNotThrow(() => {
    mf('foo');
  });

  mf = functionMock()
    .withNew(['foo']).throws(error)
    .with(['foo']).returns(1);
  t.throws(() => {
    new mf(['foo']);
  }, /Foo/);
  t.doesNotThrow(() => {
    mf(['foo']);
  });

  t.end();
});
