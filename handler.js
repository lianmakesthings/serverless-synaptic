'use strict';
const synaptic = require('synaptic');

const learn = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'You asked the machine to train a model',
      input: event,
    }),
  };

  callback(null, response);
}

const predict = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'You asked for a prediction',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports = {
  learn: learn,
  predict: predict
}
