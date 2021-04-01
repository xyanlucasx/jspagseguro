const axios = require("axios");
const qs = require("querystring");
const {
  returnXmlInJson,
  returnPattern,
  envSelector,
} = require("./internalFunctions");

const createSession = async (infosAsync) => {
  const infos = await infosAsync;
  if (infos.sessionId) return { sessiodId: infos.sessionId };
  let sessiodId = await axios.post(
    `https://ws.${envSelector(
      infos.env
    )}pagseguro.uol.com.br/sessions?${qs.stringify(infos.credentials)}`
  );
  sessiodId = returnXmlInJson(sessiodId.data);
  return { sessionId: sessiodId.session.id[0] };
};

const paymentMethods = async (infosAsync) => {
  const infos = await infosAsync;
  const options = {
    headers: {
      Accept: "application/vnd.pagseguro.com.br.v1+json;charset=ISO-8859-1",
    },
  };
  let methods = await axios.get(
    `https://ws.${envSelector(
      infos.env
    )}pagseguro.uol.com.br/payment-methods?amount=${infos.amount}&sessionId=${
      infos.sessionId
    }`,
    options
  );
  return { paymentMethods: methods.data.paymentMethods };
};

const brandCard = async (infosAsync) => {
  const infos = await infosAsync;

  let brandCard = await axios.get(
    `https://df.uol.com.br/df-fe/mvc/creditcard/v1/getBin?tk=${infos.sessionId}&creditCard=${infos.firstSix}`
  );
  if (brandCard.data.safeCheckoutResponse) {
    const pathError = brandCard.data.safeCheckoutResponse;
    throw new Error(
      `${pathError.code}, ${pathError.status}, ${pathError.message}`
    );
  }
  return { brandCard: brandCard.data.bin.brand.name };
};

const createTokenCard = async (infosAsync) => {
  const infos = await infosAsync;
  if (infos.tokenCard) return { tokenCard: infos.tokenCard };
  let tokenCard = await axios.post(
    `https://df.uol.com.br/v2/cards?sessionId=${infos.sessionId}&amount=${
      infos.amount
    }&${qs.stringify(infos.cardData)}`
  );

  if (!tokenCard.data.token)
    throw new Error(
      "001, informations invalid, credit card or sessionId are invalid"
    );
  return { tokenCard: tokenCard.data.token };
};

const installmentConditions = async (infosAsync) => {
  const infos = await infosAsync;

  let conditions = await axios.get(
    `https://${envSelector(
      infos.env
    )}pagseguro.uol.com.br/checkout/v2/installments.json?sessionId=${
      infos.sessionId
    }&amount=${infos.amount}`
  );
  if (conditions.data.error === true) {
    throw new Error(`${JSON.stringify(conditions.data.errors)}`);
  }
  return { installments: conditions.data.installments };
};

const paymentCreditCard = async (infosAsync) => {
  const infos = await infosAsync;
  if (infos.simplePurchase) {
    if (infos.version === "v2") {
      (infos.buyDetails["itemId1"] = "0001"),
        (infos.buyDetails["itemDescription1"] = "Vendas Online"),
        (infos.buyDetails["itemAmount1"] = infos.amount);
      infos.buyDetails["itemQuantity1"] = "1";
    } else {
      (infos.buyDetails["item[1].id"] = "0001"),
        (infos.buyDetails["item[1].description"] = "Vendas Online"),
        (infos.buyDetails["item[1].amount"] = infos.amount);
      infos.buyDetails["item[1].quantity"] = "1";
    }
  }
  if (infos.version === "v2") {
    infos.buyDetails["creditCardToken"] = infos.tokenCard;
  } else {
    infos.buyDetails["creditCard.token"] = infos.tokenCard;
  }
  if (!envSelector(infos.env)) {
    if (infos.version === "v2") {
      infos.buyDetails["senderHash"] = infos.senderHash;
    } else {
      infos.buyDetails["sender.hash"] = infos.senderHash;
    }
  }
  const options = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  if (!infos.version || infos.version === "v1") {
    options.headers.Accept = "application/vnd.pagseguro.com.br.v3+xml";
  }

  let transaction = await axios.post(
    `https://ws.${envSelector(infos.env)}pagseguro.uol.com.br/${
      infos.version === "v2" ? "v2/" : ""
    }transactions?${qs.stringify(infos.credentials)}`,
    qs.stringify(infos.buyDetails),
    options
  );
  transaction = returnXmlInJson(transaction.data);
  return { transactionSucess: transaction };
};

const cancelTransaction = async (infosAsync) => {
  const infos = await infosAsync;
  const status = infos.transactionDetails.status[0];
  let operation = "refunds";
  if (status === "1") operation = "cancels";
  let statusCancelation = await axios.post(
    `https://ws.${envSelector(
      infos.env
    )}pagseguro.uol.com.br/v2/transactions/${operation}?${qs.stringify(
      infos.credentials
    )}&transactionCode=${infos.transactionDetails.code[0]}&${qs.stringify(
      infos.parcialRefund || ""
    )}`
  );
  statusCancelation = returnXmlInJson(statusCancelation.data);
  return { statusCancelation: statusCancelation };
};

const transactionsByReference = async (infosAsync) => {
  const infos = await infosAsync;

  let transactionDetails = await axios.get(
    `https://ws.${envSelector(
      infos.env
    )}pagseguro.uol.com.br/v2/transactions?${qs.stringify(
      infos.credentials
    )}&reference=${infos.reference}`
  );
  transactionDetails = returnXmlInJson(transactionDetails.data);
  if (
    !(
      transactionDetails.transactionSearchResult &&
      transactionDetails.transactionSearchResult.transactions
    )
  )
    throw new Error("404, Not found, transaction not found");
  return { transactionsInfos: transactionDetails };
};

const transactionDetailsByCode = async (infosAsync) => {
  const infos = await infosAsync;
  let transactionDetails = await axios.get(`https://ws.${envSelector(
    infos.env
  )}pagseguro.uol.com.br/v3/transactions/${
    infos.transactionCode
  }?${qs.stringify(infos.credentials)}
`);
  transactionDetails = returnXmlInJson(transactionDetails.data);
  return {
    transactionDetails: transactionDetails.transaction,
  };
};

const transactionsByDate = async (infosAsync) => {
  const infos = await infosAsync;

  let transactionSearchResult = await axios.get(
    `https://ws.${envSelector(
      infos.env
    )}pagseguro.uol.com.br/v2/transactions?${qs.stringify(
      infos.credentials
    )}&${qs.stringify(infos.transactionsDate)}`
  );
  transactionSearchResult = returnXmlInJson(transactionSearchResult.data);
  return { transactionsInfos: transactionSearchResult };
};

const generateSenderHash = async (infosAsync) => {
  const keepingPromiseChain = await infosAsync; // é necessário para aguardar a função anterior a essa retornar os dados que não serão usados aqui, mas sim na função de pagar.
  let htmlPage = await axios.get(
    `https://pagseguro.uol.com.br/checkout/direct-payment/i-ck.html#rmcl`
  );
  htmlPage = htmlPage.data;
  const trackStringAux = `<input type="hidden" id="senderTrackingHash" value="`;
  const hash = htmlPage.slice(
    htmlPage.indexOf(trackStringAux) + 52,
    htmlPage.indexOf(trackStringAux) + 116
  );
  const regex = /^[0-9a-f]{64}$/;
  if (!regex.test(hash))
    throw new Error(
      "Hash veio inválido, tente novamente ou contate o desenvolvedor se o erro persistir"
    );

  return { senderHash: hash };
};

module.exports = {
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
};
