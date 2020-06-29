 
# Pacote em construção

Para fazer o uso simples, basta instalar o pacote no node com "yarn add jspagseguro" ou "npm install jspagseguro" e executar o código abaixo

```js

  const credentials = {
    email: seuemail@gmail.com,
    token: seuTokensdfjdfg,
  }
  
  const simplePurchase = true;

  const cardData = {
    cardNumber: "4111111111111111",
    cardBrand: "mastercard",
    cardCvv: "123",
    cardExpirationMonth: "04",
    cardExpirationYear: "2027",
  };

  const env = "sandbox";

  const amount = "3.00"

const {pagseguroComposer, createSession, createTokenCard, generateSenderHash, paymentCreditCard} = require("jspagseguro")

const exemplo = async (credentials, cardData, amount, buyDetails,simplePurchase) =>{

  return await pagseguroComposer(
    { credentials, cardData, amount, buyDetails, env, simplePurchase },
    createSession,
    createTokenCard,
    generateSenderHash,
    paymentCreditCard
  );
}
```

A função irá retornar as informações da transação criada, ou o erro, caso não tenha obtido sucesso na criação. Segue abaixo o formato de cada um dos parametros enviados para a função

