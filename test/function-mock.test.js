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

tp.skip(`supports chaining in any order, returns undefined if the arguments don't
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
