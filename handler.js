'use strict';
const synaptic = require('synaptic');
const s3Client = require('./lib/s3Client')
const dataBucketName = process.env.DATA_BUCKET;
const modelBucketName = process.env.MODEL_BUCKET;

const learn = (event, context, callback) => {
  s3Client.download(dataBucketName, 'combats.csv')
    .then(data => {
      console.log(data);


      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'You asked the machine to train a model'
        }),
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(new Error('[500] Internal server error'));
    });
}

const predict = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'You asked for a prediction'
    }),
  };

  callback(null, response);
};

module.exports = {
  learn: learn,
  predict: predict
}
