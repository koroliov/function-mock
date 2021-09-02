'use strict';

const de = require('deep-equal');

function functionMock() {
  const func = function func(...calledWith) {
    if (isCalledWithNew(this)) {
      return processWithNewCall(calledWith);
    } else {
      return processWithCall(calledWith);
    }
  };
  const withArgs = [];
  const responses = [];

  func.with = withFunc;
  func.withNew = withNewFunc;
  func.returns = returnsFunc;
  func.throws = throwsFunc;

  return func;

  function processWithCall(calledWith) {
    const respInd = withArgs.findIndex(args => {
      return !args.withNew &&
        de(args.value, calledWith, {strict: true}) ? true : false;
    });
    if (responses[respInd]) {
      const resp = responses[respInd];
      if (resp.isThrow) {
        throw resp.value;
      } else {
        return resp.value;
      }
    }
  }

  function processWithNewCall(calledWith) {
    const respInd = withArgs.findIndex(args => {
      return args.withNew && de(args.value, calledWith) ? true : false;
    });
    if (responses[respInd]) {
      const resp = responses[respInd];
      if (resp.isThrow) {
        throw resp.value;
      } else {
        return resp.value;
      }
    }
  }

  function withFunc(...args) {
    withArgs.push({value: args, withNew: false});
    delete func.with;
    func.returns = returnsFunc;
    func.throws = throwsFunc;
    return func;
  }
  function withNewFunc(...args) {
    withArgs.push({value: args, withNew: true});
    delete func.with;
    delete func.withNew;
    func.returns = returnsFunc;
    func.throws = throwsFunc;
    return func;
  }
  function returnsFunc(value) {
    responses.push({value, isThrow: false});
    delete func.returns;
    delete func.throws;
    func.with = withFunc;
    func.withNew = withNewFunc;
    return func;
  }
  function throwsFunc(value) {
    responses.push({value, isThrow: true});
    delete func.throws;
    delete func.returns;
    func.with = withFunc;
    func.withNew = withNewFunc;
    return func;
  }
  function isCalledWithNew(callerThis) {
    return callerThis instanceof func;
  }
}

module.exports = functionMock;
