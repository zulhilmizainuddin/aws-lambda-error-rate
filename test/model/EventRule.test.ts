import {expect} from 'chai';

import {EventRule, EventRuleInput} from '../../model/EventRule';

describe('EventRule', () => {
    let event: any;

    before(() => {
        event = {
            "alarmStatus": {
                "alarmName": "LambdaErrorAlarm",
                "oldStateValue": "OK",
                "newStateValue": "ALARM",
                "stateChangeTime": "2018-09-28T01:07:44.297+0000"
            },
            "functionName": "aws-lambda-error-rate-dev-errorRate"
        };
    });

    it('should extract event rule input', () => {
        const eventRule = new EventRule();

        const eventRuleInput: EventRuleInput = eventRule.extractRuleInput(event);

        expect(eventRuleInput).to.deep.equal({
            alarmStatus: {
                alarmName: 'LambdaErrorAlarm',
                oldStateValue: 'OK',
                newStateValue: 'ALARM',
                stateChangeTime: '2018-09-28T01:07:44.297+0000'
            },
            functionName: 'aws-lambda-error-rate-dev-errorRate'
        });
    });
});