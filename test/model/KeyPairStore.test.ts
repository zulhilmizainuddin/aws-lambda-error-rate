import {expect} from 'chai';

import {KeyPairStore} from '../../model/KeyPairStore';

describe('KeyPairStore', () => {
    it('should set and get key pair', () => {
        const keyPair: any = {
            "LambdaErrorRateFunctionName": "aws-lambda-error-rate-dev-errorRate",
            "LambdaErrorAlarmName": "LambdaErrorAlarm"
        };

        const keyPairStore = KeyPairStore.getInstance(keyPair);

        expect(keyPairStore.getValue('LambdaErrorRateFunctionName')).to.equal('aws-lambda-error-rate-dev-errorRate');
        expect(keyPairStore.getValue('LambdaErrorAlarmName')).to.equal('LambdaErrorAlarm');
    });
});