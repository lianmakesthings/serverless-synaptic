'use strict';

const s3Client = require('./lib/s3Client');
const dataBucketName = process.env.DATA_BUCKET;
const modelBucketName = process.env.MODEL_BUCKET;
const Machine = require('./lib/machine');
const fetch = require('node-fetch');

const learn = (event, context, callback) => {
    const machine = Machine.fromConfig([2, 64, 2]);

    fetch('https://www.chimney42.de/app/download/11277050297/combats.csv')
        .then(response => {
            return response.text();
        })
        .then(data => {
            console.log('data retrieved from s3');

            data = data.split("\n");
            data.shift(); // remove header
            if (!data[data.length-1]) data.pop(); // remove empty newline

            const trainingData = data.map(line => {
                let vals = line.split(',');

                let input = [
                    parseInt(vals[0]) / 800,
                    parseInt(vals[1]) / 800
                ];
                let output = (vals[2] === vals[0]) ? [1, 0] : [0, 1];
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
                    do: function (data) {
                        console.log("iterations", data.iterations, "error", data.error);
                    }
                }
            };

            console.log('training network');
            const result = machine.train(trainingData, options);
            console.log(`network was trained over ${result.iterations} iterations in ${result.time}ms. The final error was ${result.error}.`);

            let networkJSON = machine.toJSON();
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
};

const predict = (event, context, callback) => {
    const pokemon = event.queryStringParameters.pokemon.split(',');
    let input = pokemon.map(p => parseInt(p));

    s3Client.download(modelBucketName, 'model.json')
        .then(object => {
            let machine = Machine.fromJSON(JSON.parse(object));
            const probability = machine.predict(input);
            const prediction = probability.map(p => Math.round(p * 100));

            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: `The predicted chances for winning combat: ${pokemon[0]} ${prediction[0]}%, ${pokemon[1]} ${prediction[1]}%`
                }),
            };

            callback(null, response);
        })
};

module.exports = {
    learn: learn,
    predict: predict
};
