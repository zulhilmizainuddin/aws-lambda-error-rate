import {expect} from 'chai';

import * as sinon from 'sinon';

import {StackDetail} from '../../model/StackDetail';

describe('StackDetail', () => {
    let sandbox: any;
    let describeStacksOutput: any;

    before(() => {
        sandbox = sinon.createSandbox();

        describeStacksOutput = {
            "ResponseMetadata":{
                "RequestId":"95c33e7f-bcc5-11e8-b22d-c174831f5cab"
            },
            "Stacks":[
                {
                    "StackId":"arn:aws:cloudformation:ap-southeast-1:123456789012:stack/aws-lambda-error-rate-dev/5fa96c40-b65e-11e8-b89d-503a138dba36",
                    "StackName":"aws-lambda-error-rate-dev",
                    "Description":"The AWS CloudFormation template for this Serverless application",
                    "Parameters":[
        
                    ],
                    "CreationTime":"2018-09-12T07:35:08.299Z",
                    "LastUpdatedTime":"2018-09-18T03:25:06.376Z",
                    "RollbackConfiguration":{
        
                    },
                    "StackStatus":"UPDATE_COMPLETE",
                    "DisableRollback":false,
                    "NotificationARNs":[
        
                    ],
                    "Capabilities":[
                        "CAPABILITY_IAM",
                        "CAPABILITY_NAMED_IAM"
                    ],
                    "Outputs":[
                        {
                            "OutputKey":"ErrorLambdaFunctionQualifiedArn",
                            "OutputValue":"arn:aws:lambda:ap-southeast-1:123456789012:function:aws-lambda-error-rate-dev-error:13",
                            "Description":"Current Lambda function version"
                        },
                        {
                            "OutputKey":"LambdaErrorSnsTopicArn",
                            "OutputValue":"arn:aws:sns:ap-southeast-1:123456789012:aws-lambda-error-rate-dev-LambdaErrorSnsTopic-ZU96UUZ1U7SX"
                        },
                        {
                            "OutputKey":"LambdaErrorAlarmArn",
                            "OutputValue":"arn:aws:cloudwatch:ap-southeast-1:123456789012:alarm:LambdaErrorAlarm"
                        },
                        {
                            "OutputKey":"ErrorRateLambdaFunctionQualifiedArn",
                            "OutputValue":"arn:aws:lambda:ap-southeast-1:123456789012:function:aws-lambda-error-rate-dev-errorRate:14",
                            "Description":"Current Lambda function version"
                        },
                        {
                            "OutputKey":"ServerlessDeploymentBucketName",
                            "OutputValue":"aws-lambda-error-rate-de-serverlessdeploymentbuck-8a5xb9btbg82"
                        },
                        {
                            "OutputKey":"LambdaErrorRateSecurityGroup",
                            "OutputValue":"sg-0b72fe1e138ecede2"
                        }
                    ],
                    "Tags":[
                        {
                            "Key":"STAGE",
                            "Value":"dev"
                        }
                    ],
                    "EnableTerminationProtection":false
                }
            ]
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should get stack outputs', async () => {
        const stackDetail = new StackDetail();

        sandbox.stub(StackDetail.prototype, 'describeStacks').callsFake(() => {
            return describeStacksOutput;
        });

        const stackOutputs: {[key: string]: string} | null = await stackDetail.getStackOutputs('aws-lambda-error-rate-dev');

        expect(stackOutputs).to.deep.include({
            "ErrorLambdaFunctionQualifiedArn": "arn:aws:lambda:ap-southeast-1:123456789012:function:aws-lambda-error-rate-dev-error:13",
            "LambdaErrorSnsTopicArn": "arn:aws:sns:ap-southeast-1:123456789012:aws-lambda-error-rate-dev-LambdaErrorSnsTopic-ZU96UUZ1U7SX",
            "LambdaErrorAlarmArn": "arn:aws:cloudwatch:ap-southeast-1:123456789012:alarm:LambdaErrorAlarm",
            "ErrorRateLambdaFunctionQualifiedArn": "arn:aws:lambda:ap-southeast-1:123456789012:function:aws-lambda-error-rate-dev-errorRate:14",
            "ServerlessDeploymentBucketName": "aws-lambda-error-rate-de-serverlessdeploymentbuck-8a5xb9btbg82",
            "LambdaErrorRateSecurityGroup": "sg-0b72fe1e138ecede2"
        });
    });
});