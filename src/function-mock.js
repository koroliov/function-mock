'use strict';

const de = require('deep-equal');

function functionMock() {
  const func = function func(...calledWith) {
    if (isCalledWithNew(this)) {
      const respInd = func.withArgs.findIndex(args => {
        return args.withNew && de(args.value, calledWith) ? true : false;
      });
      if (func.responses[respInd]) {
        const resp = func.responses[respInd];
        if (resp.isThrow) {
          throw resp.value;
        } else {
          return resp.value;
        }
      }
    } else {
      const respInd = func.withArgs.findIndex(args => {
        return !args.withNew && de(args.value, calledWith) ? true : false;
      });
      if (func.responses[respInd]) {
        const resp = func.responses[respInd];
        if (resp.isThrow) {
          throw resp.value;
        } else {
          return resp.value;
        }
      }
    }
  };
  func.withArgs = [];
  func.responses = [];

  func.with = withFunc;
  func.withNew = withNewFunc;
  func.returns = returnsFunc;
  func.throws = throwsFunc;

  return func;

  function withFunc(...args) {
    func.withArgs.push({value: args, withNew: false});
    delete func.with;
    func.returns = returnsFunc;
    func.throws = throwsFunc;
    return func;
  }
  function withNewFunc(...args) {
    func.withArgs.push({value: args, withNew: true});
    delete func.with;
    delete func.withNew;
    func.returns = returnsFunc;
    func.throws = throwsFunc;
    return func;
  }
  function returnsFunc(value) {
    func.responses.push({value, isThrow: false});
    delete func.returns;
    delete func.throws;
    func.with = withFunc;
    func.withNew = withNewFunc;
    return func;
  }
  function throwsFunc(value) {
    func.responses.push({value, isThrow: true});
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
