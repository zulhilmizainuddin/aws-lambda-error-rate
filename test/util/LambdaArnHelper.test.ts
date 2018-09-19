import {expect} from 'chai';

import {LambdaArnHelper} from '../../util/LambdaArnHelper';

describe('LambdaArnHelper', () => {
    it('should extract function name', () => {
        const arn: string = 'arn:aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords:13'

        const functionName: string = LambdaArnHelper.extractFunctionName(arn);

        expect(functionName).to.equal('ProcessKinesisRecords');
    });

    it('should extract lambda arn without version number', () => {
        const arn: string = 'arn:aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords:13'

        const lambdaArn: string = LambdaArnHelper.extractArnWithoutVersionNumber(arn);

        expect(lambdaArn).to.equal('arn:aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords');
    });
});