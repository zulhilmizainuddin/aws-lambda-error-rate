import {expect} from 'chai';

import {EventRuleArnHelper} from '../../util/EventRuleArnHelper';

describe('EventRuleArnHelper', () => {
    it('should extract event rule name', () => {
        const arn: string = 'arn:aws:events:us-east-1:123456789012:rule/my-rule';

        const functionName1: string = EventRuleArnHelper.extractRuleName(arn);

        expect(functionName1).to.equal('my-rule')
    });
});