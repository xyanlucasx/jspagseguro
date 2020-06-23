const xml2js = require("xml2js").parseString;

const returnPattern = (content) => {
  return content;
};

const errorHandler = (err) => {
  let errors = {};
  let dataResponse;
  if (err.response && err.response.data) {
    let data = err.response.data;
    if (
      typeof data === "string" &&
      data.indexOf(`<?xml version="1.0"`) !== -1
    ) {
      data = returnXmlInJson(data);
      let erros = [];
      for (let errorInArray of data.errors.error) {
        erros.push(`${errorInArray.code[0]}, ${errorInArray.message[0]}`);
      }
      dataResponse = erros;
    } else if (typeof data === "object") {
      dataResponse = `${err.response.status}, ${
        err.response.statusText
      }, ${JSON.stringify(data.errors)}`;
    } else {
      dataResponse = `${err.response.status}, ${err.response.statusText}, ${err.response.data}`;
    }
  } else {
    dataResponse = err.message;
  }

  errors.error = dataResponse;
  errors.stack = err.stack.slice(err.stack.indexOf("\n") + 1);
  return errors;
};

const returnXmlInJson = (xml) => {
  let response;

  xml2js(xml, (err, result) => {
    response = result;
  });
  return response;
};

const envSelector = (env) => {
  return env ? env + "." : "";
};

module.exports = {
  returnPattern,
  errorHandler,
  returnXmlInJson,
  envSelector,
};
