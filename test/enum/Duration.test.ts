import {expect} from 'chai';

import {Duration, DurationHelper} from '../../enum/Duration';

describe('Duration', () => {
    it('should get duration', () => {
        const value: number = 300;

        const duration: Duration = DurationHelper.getDuration(value);

        expect(duration).to.equal(Duration.ThreeHundredSeconds);
    });
});