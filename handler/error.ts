import {Context, Callback} from 'aws-lambda';

module.exports.error = (event: any, context: Context, callback: Callback) => {

    const error = new Error('Something went wrong')

    return callback(error);
};