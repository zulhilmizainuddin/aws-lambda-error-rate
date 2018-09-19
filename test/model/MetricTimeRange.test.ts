import {expect} from 'chai';

import moment from 'moment';

import {MetricTimeRange, MetricTimeRangeHelper} from '../../model/MetricTimeRange'

describe('MetricTimeRange', () => {
    it('calculate metric time range', () => {
        const metricTimeRange: MetricTimeRange =
            MetricTimeRangeHelper.calculate('2018-08-25T02:07:48.443+0000', 300);

        const expectedStartTimeStr = metricTimeRange.start.toString().trim();
        expect(expectedStartTimeStr).to.equal(moment('2018-08-25T02:02:49.443+0000').toDate().toString());

        const expectedEndTimeStr = metricTimeRange.end.toString().trim();
        expect(expectedEndTimeStr).to.equal(moment('2018-08-25T02:07:49.443+0000').toDate().toString());
    });
});