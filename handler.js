'use strict';
const synaptic = require('synaptic');
const Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;
const s3Client = require('./lib/s3Client')
const dataBucketName = process.env.DATA_BUCKET;
const modelBucketName = process.env.MODEL_BUCKET;

const learn = (event, context, callback) => {
  let network = new Architect.Perceptron(2, 64, 2)
  let trainer = new Trainer(network)

  s3Client.download(dataBucketName, 'combats.csv')
    .then(data => {
      console.log('data retrieved from s3')

      data = data.split("\n");
      data.shift(); // remove header
      const trainingSet = data.map(line => {
        let vals = line.split(',');
        let input = [
          parseInt(vals[0]) / 800,
          parseInt(vals[1]) / 800
        ];
        let output = (vals[2] == vals[0]) ? [1, 0] : [0, 1]
        return {
          input: input,
          output: output
        }
      });

      const options = {
        iterations: 10,
        rate: .005,
      	shuffle: true,
        schedule: {
        	every: 1,
        	do: function(data) {
        		console.log("iterations", data.iterations, "error", data.error);
        	}
        }
      };
      console.log('training network')
      const result = trainer.train(trainingSet, options)
      console.log(`network was trained over ${result.iterations} iterations in ${result.time}ms. The final error was ${result.error}.`);

      let networkJSON = network.toJSON()
      return s3Client.upload(modelBucketName, 'model.json', JSON.stringify(networkJSON))
    })
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Model was successfully uploaded to s3.'
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
