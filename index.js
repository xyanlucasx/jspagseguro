const {
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
  } = require("./lib/routinesPagseguro");
  
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
  