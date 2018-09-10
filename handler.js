'use strict';

module.exports.errorRate = (event, context, callback) => {

  const result = {
    message: 'Go Serverless v1.0! Your function executed successfully!',
    event
  };

  callback(null, result);
};

module.exports.error = (event, context, callback) => {
  
  const error = new Error('Something went wrong')

  callback(error);
};