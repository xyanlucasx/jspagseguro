# Modulo em construção

O modulo possui outras funcionalidades, irei documenta-las melhor aos poucos. Com o que há aqui já é possível utilizar da maneira simples.

Para fazer o uso simples basta instalar o pacote no node com "yarn add jspagseguro" ou "npm install jspagseguro" e executar o código abaixo, adapte para os dados reais.

O exemplo abaixo usa o ambiente sandbox para testes, para usar o ambiente de produção basta não enviar o argumento "env" junto aos outros. Para usar pagamento Split troque "email" e "token" no objeto credentials para "appId" e "appKey"

```js

const {pagseguroComposer,
      createSession,
      createTokenCard,
      generateSenderHash,
      paymentCreditCard} = require("jspagseguro")

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

const buyDetails = {
  "payment.mode": "default",
  "payment.method": "creditCard",
  currency: "BRL",
  reference: "REF1236",
  "sender.name": "Fulano detal",
  "sender.CPF": "0520998369",
  "sender.areaCode": "85",
  "sender.phone": "998603169",
  "sender.email": "yanlucas@sandbox.pagseguro.com.br",
  "shipping.address.required": "false",
  "creditCard.token": "",
  "installment.quantity": "1",
  "installment.value": "3.00",
  "creditCard.holder.name": "Fulano detal",
  "creditCard.holder.CPF": "0520998369",
  "creditCard.holder.birthDate": "23/12/1990",
  "creditCard.holder.areaCode": "85",
  "creditCard.holder.phone": "998603169",
  "billingAddress.street": "Rua Alameda Senhora Plinio",
  "billingAddress.number": "90",
  "billingAddress.complement": "casa",
  "billingAddress.district": "juvenalBairro",
  "billingAddress.postalCode": "60024760",
  "billingAddress.city": "Fortaleza",
  "billingAddress.state": "CE",
  "billingAddress.country": "BRA",
    //Os campos abaixo só são necessários
   //para pagamento Split
  //"primaryReceiver.email": "primeiro@live.com",
 //"receiver[1].email": "receiver@hotmail.com",
//"receiver[1].split.amount": "1.00",
};

const exemplo = async (credentials, cardData, amount, buyDetails,simplePurchase) =>{

  const transac = await pagseguroComposer(
    { credentials, cardData, amount, buyDetails, env, simplePurchase },
    createSession,
    createTokenCard,
    generateSenderHash,
    paymentCreditCard
  );

  console.log(transac)
}

exemplo(credentials,
        cardData,
        amount,
        buyDetails,
        env,
        simplePurchse)
```

A função irá mostrar na tela as informações da transação criada ou o erro, caso não tenha obtido sucesso na criação. O erro informa o que foi enviado de errado.
