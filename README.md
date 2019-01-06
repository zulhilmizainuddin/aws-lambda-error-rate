# aws-lambda-error-rate [![Build Status](https://travis-ci.org/zulhilmizainuddin/aws-lambda-error-rate.svg?branch=master)](https://travis-ci.org/zulhilmizainuddin/aws-lambda-error-rate)
AWS Lambda error rate monitoring application using Node.js, TypeScript, Serverless, AWS Lambda, CloudFormation, CloudWatch, S3, SNS and PagerTree

## Prerequisite
- Node.js
- Serverless CLI
- AWS account
- AWS CLI credentials

## Setup
Set `VPC` ID, `subnet` IDs and `incident integration` url in `serverless-dev.yml`.

## Dependencies
```
$ npm i -g serverless
$ npm install
```

## Compile
```
$ npm run build
```

## Test
```
$ npm test
```

## Deploy
```
$ sls deploy -v
```

## Sequence Diagram
![sequence-diagram](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/zulhilmizainuddin/aws-lambda-error-rate/master/sequence-diagram.plantuml)
