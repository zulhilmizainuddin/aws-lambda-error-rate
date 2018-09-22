import {expect} from 'chai';

import {AlarmNotification, AlarmStatus} from '../../model/AlarmNotification';

describe('AlarmNotification', () => {
    let notification: any;

    before(() => {
        notification = {
            "Type" : "Notification",
            "MessageId" : "52cc9eaf-1708-58c2-9654-ca8f3a61dc3b",
            "TopicArn" : "arn:aws:sns:ap-southeast-1:123456789012:aws-lambda-error-rate-dev-LambdaErrorSnsTopic-ZU96UUZ1U7SX",
            "Subject" : "ALARM: \"LambdaErrorAlarm\" in Asia Pacific (Singapore)",
            "Message" : "{\"AlarmName\":\"LambdaErrorAlarm\",\"AlarmDescription\":\"Lambda error alarm\",\"AWSAccountId\":\"123456789012\",\"NewStateValue\":\"ALARM\",\"NewStateReason\":\"Threshold Crossed: 1 datapoint [1.0 (22/09/18 11:43:00)] was greater than the threshold (0.0).\",\"StateChangeTime\":\"2018-09-22T11:44:41.175+0000\",\"Region\":\"Asia Pacific (Singapore)\",\"OldStateValue\":\"OK\",\"Trigger\":{\"MetricName\":\"Errors\",\"Namespace\":\"AWS/Lambda\",\"StatisticType\":\"Statistic\",\"Statistic\":\"SUM\",\"Unit\":\"Count\",\"Dimensions\":[{\"name\":\"FunctionName\",\"value\":\"aws-lambda-error-rate-dev-error\"}],\"Period\":60,\"EvaluationPeriods\":1,\"ComparisonOperator\":\"GreaterThanThreshold\",\"Threshold\":0.0,\"TreatMissingData\":\"- TreatMissingData:                    NonBreaching\",\"EvaluateLowSampleCountPercentile\":\"\"}}",
            "Timestamp" : "2018-09-22T11:44:41.219Z",
            "SignatureVersion" : "1",
            "Signature" : "Bm99QDD3EQTjHySJKklkF6CSGUUmLDSf/FRUMMh6GP1Ks3D8DjYJEVUCSY8d/K3z4PG9RX8xQgt4p8DbU8SlEbQ5SOHeVJvoYVXmoorhVvbnVBjIqF54yyR6fLX9WBRtrSQ313OoODhMyA+gGrLxsBgP43Nxnj1CbNYbaV8a3MGlvSMEnX3x+Z49LJxO1LhZK+chJ4V/Pqkfhi82LRzfmOB79rT4KBmVkFIkg/7Yd6GKylTQBvZ8b7HEaYS6hEuqRR8YxYgAM3ZFB8YfmmdAD0B6SBP+zdv9bR0R5Fi6sD4iSt63srI++X2xU1ERM7DxBrgSRoOYVarm397fHsSCyA==",
            "SigningCertURL" : "https://sns.ap-southeast-1.amazonaws.com/SimpleNotificationService-ac565b8b1a6c5d002d285f9598aa1d9b.pem",
            "UnsubscribeURL" : "https://sns.ap-southeast-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-southeast-1:123456789012:aws-lambda-error-rate-dev-LambdaErrorSnsTopic-ZU96UUZ1U7SX:43d09960-16f9-4032-8298-a31421d8d821"
          };
    });

    it('should get alarm status', () => {
        const alarmNotification = new AlarmNotification();

        const alarmStatus: AlarmStatus = alarmNotification.extractAlarmStatus(notification);

        expect(alarmStatus).to.deep.equal({
            alarmName: 'LambdaErrorAlarm',
            oldStateValue: 'OK',
            newStateValue: 'ALARM'
        });
    });
});