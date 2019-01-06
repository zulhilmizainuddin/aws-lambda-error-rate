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

![sequence-diagram](https://www.plantuml.com/plantuml/svg/pLTTRzem57r7uZzSQG-La8hMiRtmC9LsdJIfcohOj6TZNuY5iJFReVJVxnedu8IKqfPDpGD9x7kFZu_lHxXqdbbVB5MtunPIvyoo9TpHaEGoPzhVCI6adiFWVMfmPTRLn0LDT3jJiuPtjtAU-IjLO1XXXJUwM4xHqZFtni8epyC4tU3yCzoovLIm8OpnJu7EWs2UTJjnD9s_iTPOYoAT8uXo0Yowt6YtMHAr029IvtFzm7IJJxUZZKUmOHxC3AwLASHlvddMxG1TlTu4VP7tUl7refzOW7J0b4Kc7i2X1szWQRGC6om9OY3cekk7VcsKF9bTja1C4MR6tZChK8JtoOy9tNB98yoWlnlPkdAwUJ9djEqIfiGebw61ZKXZCeii8jf7GXl0jE0ByaguL83avsW_259pAL1xc2asZxwV-XGTSxG_BI8mpar1quymAd8GHcCycA1uK3vHyfoESlSwh2ibq2FtuTmR7YJ442O1ShlBHAtm6AmQ6n_2rrIQGAHX0MrEDsjlANZBbRZHdjHeTTsHl5cHZHl2zKOC2b1UM1ionHOAzsElzOJ6DQUmnHojD49ofjH3jE4PyaKfbcM-8RCo9WVcG1a2eNkT1k1QEXzncipRvVkcLsQ1oNAW4hu71I4fDbJBkQWbbPr8DBWpLKaiDPoDRaVZxsUL1PHN6WKj_6hWZwEq49qCAeADSDzv1NvvcW-SkGGqN9HGxR8ba9GDwC89fV8VO9PAM9N9MQFEb4TVnmfyvImzh2agSmy-etAP6INgviVB-np4O_BhYmboP1IMTNzK3XixO5EpmfFku4d4bXriQzyslxSnmHHQVnH8YBX9ABtxvNKhW4xuRDJ8ZVEl3i3_7dVEIwNUoDcz9lg4DNbEdUtqUNGqyk5e7ACpQlNYSFobtU60V39KghOtncKuclssrqGxeWqshn5zv6JqmP8RgNsxYS-m-XuBYvDn_0Hfimqn7UmTEYUDtZVQDTJ7SxDwsGHDR3-Xmf-caHr6UdapaqUtfN_HruvAn9Y4JrMl4rQzPoRJInFfT4dqnXDeFtbskH8UDZ_9dxPBUgB_eNy1 "sequence-diagram")
