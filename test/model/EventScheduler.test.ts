import {expect} from 'chai';

import * as sinon from 'sinon';

import {AlarmStatus} from '../../model/AlarmNotification';
import {EventScheduler} from '../../model/EventScheduler';

import {RateExpression} from '../../enum/RateExpression';

describe('EventScheduler', () => {
    let sandbox: any;
    let alarmStatus: AlarmStatus;

    before(() => {
        sandbox = sinon.createSandbox();

        alarmStatus = {
            "alarmName": "LambdaErrorAlarm",
            "oldStateValue": "OK",
            "newStateValue": "ALARM",
            "stateChangeTime": "2018-09-26T02:59:41.187+0000",
            "erroredFunctionName": "aws-lambda-error-rate-dev-error"
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should create rule', async () => {
        const eventScheduler = new EventScheduler();

        sandbox.stub(EventScheduler.prototype, 'putRecurringRule').callsFake(() => {
            return 'arn:aws:events:ap-southeast-1:123456789012:rule/LambdaErrorAlarm-Rule';
        });

        sandbox.stub(EventScheduler.prototype, 'putRecurringRuleTarget').callsFake(() => {
            return true;
        });

        sandbox.stub(EventScheduler.prototype, 'addPermissionToTriggerFunction').callsFake(() => {
            return true;
        });

        const isSuccess: boolean = await eventScheduler.createEvent(
            alarmStatus,
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

        const isDeleted: boolean = await eventScheduler.deleteEvent(alarmStatus.alarmName, 'aws-lambda-error-rate-dev-errorRate');

        expect(isDeleted).to.be.true;
    });
});