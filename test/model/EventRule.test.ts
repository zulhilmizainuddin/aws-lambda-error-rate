import {expect} from 'chai';

import {EventRule, EventRuleInput} from '../../model/EventRule';

describe('EventRule', () => {
    let event: any;

    before(() => {
        event = {
            "ruleName": 'LambdaErrorAlarm-Rule',
            "functionName": 'aws-lambda-error-rate-dev-errorRate'
        };
    });

    it('should extract event rule input', () => {
        const eventRule = new EventRule();

        const eventRuleInput: EventRuleInput = eventRule.extractRuleInput(event);

        expect(eventRuleInput).to.deep.equal({
            ruleName: 'LambdaErrorAlarm-Rule',
            functionName: 'aws-lambda-error-rate-dev-errorRate'
        });
    });
});