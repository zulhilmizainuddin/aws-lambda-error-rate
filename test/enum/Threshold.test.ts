import {expect} from 'chai';

import {Threshold, ThresholdHelper} from '../../enum/Threshold';

describe('Threshold', () => {
    it('should get threshold', () => {
        const value: number = 1;

        const threshold: Threshold = ThresholdHelper.getThreshold(value);

        expect(threshold).to.equal(Threshold.OnePercent);
    });
});