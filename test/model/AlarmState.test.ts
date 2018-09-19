import {expect} from 'chai';

import * as sinon from 'sinon';

import {AlarmState} from '../../model/AlarmState';

describe('AlarmState', () => {
    let sandbox: any;
    let describeAlarmOutput: any;

    before(() => {
        sandbox = sinon.createSandbox();

        describeAlarmOutput = {
            "ResponseMetadata":{
                "RequestId":"0dd09f98-ba0c-11e8-9c6e-a3e7eebb95f2"
            },
            "MetricAlarms":[
                {
                    "AlarmName":"aws-lambda-error-rate-dev-LambdaErrorAlarm-17CU0S1GI648Z",
                    "AlarmArn":"arn:aws:cloudwatch:ap-southeast-1:123456789012:alarm:aws-lambda-error-rate-dev-LambdaErrorAlarm-17CU0S1GI648Z",
                    "AlarmDescription":"Lambda error alarm",
                    "AlarmConfigurationUpdatedTimestamp":"2018-09-12T07:36:23.419Z",
                    "ActionsEnabled":true,
                    "OKActions":[
                        "arn:aws:sns:ap-southeast-1:123456789012:aws-lambda-error-rate-dev-LambdaErrorSnsTopic-ZU96UUZ1U7SX"
                    ],
                    "AlarmActions":[
                        "arn:aws:sns:ap-southeast-1:123456789012:aws-lambda-error-rate-dev-LambdaErrorSnsTopic-ZU96UUZ1U7SX"
                    ],
                    "InsufficientDataActions":[
        
                    ],
                    "StateValue":"OK",
                    "StateReason":"Threshold Crossed: no datapoints were received for 1 period and 1 missing datapoint was treated as [NonBreaching].",
                    "StateReasonData":"{\"version\":\"1.0\",\"queryDate\":\"2018-09-16T00:22:56.053+0000\",\"unit\":\"Count\",\"statistic\":\"Sum\",\"period\":60,\"recentDatapoints\":[],\"threshold\":0.0}",
                    "StateUpdatedTimestamp":"2018-09-16T00:22:56.063Z",
                    "MetricName":"Errors",
                    "Namespace":"AWS/Lambda",
                    "Statistic":"Sum",
                    "Dimensions":[
                        {
                            "Name":"FunctionName",
                            "Value":"aws-lambda-error-rate-dev-error"
                        }
                    ],
                    "Period":60,
                    "Unit":"Count",
                    "EvaluationPeriods":1,
                    "Threshold":0,
                    "ComparisonOperator":"GreaterThanThreshold",
                    "TreatMissingData":"notBreaching"
                }
            ]
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('get alarm state', async () => {
        const alarmState = new AlarmState();
        sandbox.stub(AlarmState.prototype, 'getDescribeAlarmOutput').callsFake(() => {
            return describeAlarmOutput;
        });

        const stateValue: string = await alarmState.getState('aws-lambda-error-rate-dev-LambdaErrorAlarm-17CU0S1GI648Z');
        
        expect(stateValue).to.equal('OK');
    });
});