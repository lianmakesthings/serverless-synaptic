# Serverless synaptic
Machine Learning application with lambda functions

This project showcases how to setup a simple machine learning application with only lambda functions.
As an example our ml application takes two pokemon and will predict the chances of victory for each.

Data:
https://www.kaggle.com/terminus7/pokemon-challenge/data

ML library:
https://github.com/cazala/synaptic

Infrastructure:
https://serverless.com/

## How it works
Overview: 
![application diagram][overview]

[overview]: ./assets/serverless%20synaptic.png "serverless synaptic overview"


## Setup
Install node, npm, serverless, serverless offline, synaptic, aws-sdk

`$ brew install node`

`$ npm install synaptic aws-sdk --save`  
`$ npm install serverless -g`  
`$ npm install serverless-offline --save-dev`

Setup aws credentials



## Usage

### Local dev
`$ serverless offline`  
```
Serverless: Starting Offline: dev/eu-central-1.

Serverless: Routes for learn:
Serverless: (none)
Serverless: GET /learn

Serverless: Routes for predict:
Serverless: GET /predict

Serverless: Offline listening on http://localhost:3000
```

### Deploy to cloud
`$ serverless deploy`
```
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (6.22 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
....................
Serverless: Stack update finished...
Service Information
service: serverless-synaptic
stage: dev
region: eu-central-1
stack: serverless-synaptic-dev
api keys:
  None
endpoints:
  GET - https://someHash.execute-api.eu-central-1.amazonaws.com/dev/learn
  GET - https://someHash.execute-api.eu-central-1.amazonaws.com/dev/predict
functions:
  learn: serverless-synaptic-dev-learn
  predict: serverless-synaptic-dev-predict
Serverless: Publish service to Serverless Platform...
Service successfully published! Your service details are available at:
https://platform.serverless.com/services/Chimney42/serverless-synaptic
Serverless: Removing old service versions...

```