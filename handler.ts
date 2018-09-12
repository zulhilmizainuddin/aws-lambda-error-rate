import {APIGatewayEvent, Context, Callback} from 'aws-lambda';

module.exports.errorRate = (event: APIGatewayEvent, context: Context, callback: Callback) => {

  const result = {
    message: 'Go Serverless v1.0! Your function executed successfully!',
    event
  };

  callback(null, result);
};

module.exports.error = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  
  const error = new Error('Something went wrong')

  callback(error);
};