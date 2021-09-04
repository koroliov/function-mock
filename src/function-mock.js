'use strict';

const de = require('deep-equal');

function functionMock() {
  function returnedToUserFunction(...argsCalledWith) {
    return processResponse(findResponse(this));

    function processResponse(response) {
      if (response.isThrow) {
        throw response.value;
      } else {
        return response.value;
      }
    }

    function findResponse(mockFunctionThisVal) {
      const calledWithNew = isCalledWithNew();
      const respInd = withArgs.findIndex(args => {
        return (calledWithNew ? args.withNew : !args.withNew) &&
          doArgumentsMatch(args);
      });
      if (responses[respInd]) {
        return responses[respInd];
      } else if (calledWithNew) {
        return defaultResponseWhenCalledWithNew;
      } else {
        return defaultResponse;
      }

      function isCalledWithNew() {
        return mockFunctionThisVal instanceof returnedToUserFunction;
      }

      function doArgumentsMatch(argsToMatch) {
        return de(argsToMatch.value, argsCalledWith, {strict: true}) ?
          true : false;
      }
    }
  };

  const withArgs = [];
  const responses = [];
  const defaultResponse = {value: undefined, isThrow: false};
  const defaultResponseWhenCalledWithNew = {value: undefined, isThrow: false};

  let valueProvidedToBeReturnedOrThrownFromCallWithNew = true;
  let isFinalCallInChain = false;

  return expectWithMethodsCall();

  function expectReturnsOrThrowsMethodsCall() {
    delete returnedToUserFunction.with;
    delete returnedToUserFunction.withNew;
    delete returnedToUserFunction.withOther;
    delete returnedToUserFunction.withOtherNew;
    returnedToUserFunction.returns = returnsFunc;
    returnedToUserFunction.throws = throwsFunc;
    return returnedToUserFunction;
  }

  function expectWithMethodsCall() {
    delete returnedToUserFunction.returns;
    delete returnedToUserFunction.throws;
    returnedToUserFunction.with = withFunc;
    returnedToUserFunction.withNew = withNewFunc;
    returnedToUserFunction.withOther = withOtherFunc;
    returnedToUserFunction.withOtherNew = withOtherNewFunc;
    return returnedToUserFunction;
  }

  function processFinalReturnsOrThrowsCall(value, isThrow) {
    if (valueProvidedToBeReturnedOrThrownFromCallWithNew) {
      defaultResponseWhenCalledWithNew.value = value;
      defaultResponseWhenCalledWithNew.isThrow = isThrow;
      delete returnedToUserFunction.withOtherNew;
      if (!isFinalCallInChain) {
        returnedToUserFunction.withOther = withOtherFunc;
      }
    } else {
      defaultResponse.value = value;
      defaultResponse.isThrow = isThrow;
      delete returnedToUserFunction.withOther;
      if (!isFinalCallInChain) {
        returnedToUserFunction.withOtherNew = withOtherNewFunc;
      }
    }
    delete returnedToUserFunction.returns;
    delete returnedToUserFunction.throws;
    delete returnedToUserFunction.with;
    delete returnedToUserFunction.withNew;
    isFinalCallInChain = true;
    return returnedToUserFunction;
  }

  function expectWithOtherMethodsCall(isMethodCalledWithOtherNew) {
    delete returnedToUserFunction.with;
    delete returnedToUserFunction.withNew;
    delete returnedToUserFunction.withOther;
    delete returnedToUserFunction.withOtherNew;
    returnedToUserFunction.returns = returnsFinalFunc;
    returnedToUserFunction.throws = throwsFinalFunc;
    valueProvidedToBeReturnedOrThrownFromCallWithNew =
      isMethodCalledWithOtherNew;
    return returnedToUserFunction;
  }

  function returnsFinalFunc(value) {
    return processFinalReturnsOrThrowsCall(value, false);
  }
  function throwsFinalFunc(value) {
    return processFinalReturnsOrThrowsCall(value, true);
  }
  function withFunc(...args) {
    withArgs.push({value: args, withNew: false});
    return expectReturnsOrThrowsMethodsCall();
  }
  function withNewFunc(...args) {
    withArgs.push({value: args, withNew: true});
    return expectReturnsOrThrowsMethodsCall();
  }
  function returnsFunc(value) {
    responses.push({value, isThrow: false});
    return expectWithMethodsCall();
  }
  function throwsFunc(value) {
    responses.push({value, isThrow: true});
    return expectWithMethodsCall();
  }
  function withOtherFunc() {
    return expectWithOtherMethodsCall(false);
  }
  function withOtherNewFunc() {
    return expectWithOtherMethodsCall(true);
  }
}

module.exports = functionMock;
