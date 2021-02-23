'use strict';

const de = require('deep-equal');

function mockFunction() {
  const func = function func(...calledWith) {
    const respInd = func.withArgs.findIndex((args) => {
      return de(args, calledWith) ? true : false;
    });
    if (func.responses[respInd]) {
      const resp = func.responses[respInd];
      if (resp.isThrow) {
        throw func.responses[respInd].value;
      } else {
        return func.responses[respInd].value;
      }
    }
  };
  func.withArgs = [];
  func.responses = [];

  func.with = withFunc;
  func.returns = returnsFunc;
  func.throws = throwsFunc;

  return func;

  function withFunc(...args) {
    func.withArgs.push(args);
    delete func.with;
    func.returns = returnsFunc;
    func.throws = throwsFunc;
    return func;
  }
  function returnsFunc(value) {
    func.responses.push({value, isThrow: false});
    delete func.returns;
    delete func.throws;
    func.with = withFunc;
    return func;
  }
  function throwsFunc(value) {
    func.responses.push({value, isThrow: true});
    delete func.throws;
    delete func.returns;
    func.with = withFunc;
    return func;
  }
}

module.exports = mockFunction;
