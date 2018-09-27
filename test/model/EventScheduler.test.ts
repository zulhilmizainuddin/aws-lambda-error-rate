import {expect} from 'chai';

import * as sinon from 'sinon';

import {EventScheduler} from '../../model/EventScheduler';
import {RateExpression} from '../../enum/RateExpression';

describe('EventScheduler', () => {
    let sandbox: any;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should create rule', async () => {
        const eventScheduler = new EventScheduler();

        sandbox.stub(EventScheduler.prototype, 'putRecurringRule').callsFake(() => {
            return 'arn:aws:lambda:ap-southeast-1:123456789012:function:aws-lambda-error-rate-dev-errorRate'
        });

        sandbox.stub(EventScheduler.prototype, 'putRecurringRuleTarget').callsFake(() => {
            return true;
        });

        sandbox.stub(EventScheduler.prototype, 'addPermissionToTriggerFunction').callsFake(() => {
            return true;
        });

        const isSuccess: boolean = await eventScheduler.createEvent(
            'LambdaErrorAlarm',
            RateExpression.OneMinute,
            'arn:aws:lambda:ap-southeast-1:123456789012:function:aws-lambda-error-rate-dev-errorRate',
            'aws-lambda-error-rate-dev-errorRate');

        expect(isSuccess).to.be.true;

    });

    it('should delete rule', async () => {
        const eventScheduler = new EventScheduler();

        sandbox.stub(EventScheduler.prototype, 'removePermissionToTriggerFunction').callsFake(() => {
            return true;
        });

        sandbox.stub(EventScheduler.prototype, 'removeRecurringRuleTarget').callsFake(() => {
            return true;
        });

        sandbox.stub(EventScheduler.prototype, 'deleteRecurringRule').callsFake(() => {
            return true;
        });

        const isDeleted: boolean = await eventScheduler.deleteEvent('LambdaErrorAlarm-Rule', 'aws-lambda-error-rate-dev-errorRate');

        expect(isDeleted).to.be.true;
    });
});