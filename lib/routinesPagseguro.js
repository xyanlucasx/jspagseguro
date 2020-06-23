const {
    returnPattern,
    createSession,
    paymentMethods,
    brandCard,
    createTokenCard,
    installmentConditions,
    paymentCreditCard,
    cancelTransaction,
    transactionsByReference,
    transactionDetailsByCode,
    transactionsByDate,
    generateSenderHash,
    generateSplitAuthorization,
  } = require("./basePagseguro");
  const { errorHandler } = require("./internalFunctions");
  
  const pagseguroComposer = async (infosAsync, ...baseFunctions) => {
    try {
      const res = await baseFunctions.reduce(
        async (infoAccumulator, baseFunction) => {
          const objectReturnBybaseFunction = await baseFunction(infoAccumulator);
          const keyName = Object.keys(objectReturnBybaseFunction)[0];
          infosAsync[keyName] = objectReturnBybaseFunction[keyName];
          return infosAsync;
        },
        infosAsync
      );
      const arrayOfKeys = Object.keys(res);
      const lastKey = arrayOfKeys[arrayOfKeys.length - 1];
      const lastValue = res[lastKey];
      const lastResponse = { [lastKey]: lastValue };
      return returnPattern(lastResponse);
    } catch (err) {
      return returnPattern(errorHandler(err));
    }
  };
  
  module.exports = {
    pagseguroComposer,
    createSession,
    paymentMethods,
    brandCard,
    createTokenCard,
    installmentConditions,
    paymentCreditCard,
    cancelTransaction,
    transactionsByReference,
    transactionDetailsByCode,
    transactionsByDate,
    generateSenderHash,
  };
  