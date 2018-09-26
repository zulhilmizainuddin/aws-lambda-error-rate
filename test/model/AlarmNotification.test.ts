import {expect} from 'chai';

import {AlarmNotification, AlarmStatus} from '../../model/AlarmNotification';

describe('AlarmNotification', () => {
    let event: any;

    before(() => {
        event = {
            "Records": [
                {
                    "EventSource": "aws:sns",
                    "EventVersion": "1.0",
                    "EventSubscriptionArn": "arn:aws:sns:ap-southeast-1:123456789012:aws-lambda-error-rate-dev-LambdaErrorSnsTopic-ZU96UUZ1U7SX:465f7222-c21a-46d7-b94c-b7ae2cc19dd7",
                    "Sns": {
                        "Type": "Notification",
                        "MessageId": "ed884a60-b653-5651-8ed5-1e444e0e3f24",
                        "TopicArn": "arn:aws:sns:ap-southeast-1:123456789012:aws-lambda-error-rate-dev-LambdaErrorSnsTopic-ZU96UUZ1U7SX",
                        "Subject": "ALARM: \"LambdaErrorAlarm\" in Asia Pacific (Singapore)",
                        "Message": "{\"AlarmName\":\"LambdaErrorAlarm\",\"AlarmDescription\":\"Lambda error alarm\",\"AWSAccountId\":\"123456789012\",\"NewStateValue\":\"ALARM\",\"NewStateReason\":\"Threshold Crossed: 1 datapoint [1.0 (26/09/18 02:58:00)] was greater than the threshold (0.0).\",\"StateChangeTime\":\"2018-09-26T02:59:41.187+0000\",\"Region\":\"Asia Pacific (Singapore)\",\"OldStateValue\":\"OK\",\"Trigger\":{\"MetricName\":\"Errors\",\"Namespace\":\"AWS/Lambda\",\"StatisticType\":\"Statistic\",\"Statistic\":\"SUM\",\"Unit\":\"Count\",\"Dimensions\":[{\"name\":\"FunctionName\",\"value\":\"aws-lambda-error-rate-dev-error\"}],\"Period\":60,\"EvaluationPeriods\":1,\"ComparisonOperator\":\"GreaterThanThreshold\",\"Threshold\":0.0,\"TreatMissingData\":\"- TreatMissingData:                    NonBreaching\",\"EvaluateLowSampleCountPercentile\":\"\"}}",
                        "Timestamp": "2018-09-26T02:59:41.210Z",
                        "SignatureVersion": "1",
                        "Signature": "qw+fy46gD0L0iQEt0HKPGbR6f1fZo2ilGM0Wa9oZ2ol21UuR1trj39t8Iu0lWqJ01PNpy2Vg4p5SdZaGSIM6VnyNhuS23J6phViuwBTZEWqQzXH7/q0ELQ/82xB7CDqFy9lQA1pXCa/+mrZnTGaMUaDijiRtwAGNRvm/tqjzuo2ZxU1jq5tSD353okdxBPRb/8db9zM2JqFNP8xkBPFvVX8h6nshSBiLfsYQHflDG+OlQPj1gbk9cQrkLP3CE3lNtKT7zFFIAn6ZpIKou7cZt2NzIVBQ5sFu+x7b6bUkCRl85hR01knl5EDXGH5Xb8QsKS4wrJ9A7KkwVfqPGNyvvQ==",
                        "SigningCertUrl": "https://sns.ap-southeast-1.amazonaws.com/SimpleNotificationService-ac565b8b1a6c5d002d285f9598aa1d9b.pem",
                        "UnsubscribeUrl": "https://sns.ap-southeast-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-southeast-1:123456789012:aws-lambda-error-rate-dev-LambdaErrorSnsTopic-ZU96UUZ1U7SX:465f7222-c21a-46d7-b94c-b7ae2cc19dd7",
                        "MessageAttributes": {}
                    }
                }
            ]
        };
    });

    it('should get alarm status', () => {
        const alarmNotification = new AlarmNotification();

        const alarmStatus: AlarmStatus | null = alarmNotification.extractAlarmStatus(event);

        expect(alarmStatus).to.deep.equal({
            alarmName: 'LambdaErrorAlarm',
            oldStateValue: 'OK',
            newStateValue: 'ALARM',
            stateChangeTime: '2018-09-26T02:59:41.187+0000'
        });
    });
});