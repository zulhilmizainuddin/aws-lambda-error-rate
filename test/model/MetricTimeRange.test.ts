import {expect} from 'chai';

import moment from 'moment';

import {Duration} from '../../enum/Duration';
import {MetricTime, MetricTimeRange} from '../../model/MetricTimeRange'

describe('MetricTimeRange', () => {
    it('calculate metric time range', () => {
        const metricTimeRange = new MetricTimeRange();
        const metricTime: MetricTime = metricTimeRange.calculate('2018-08-25T02:07:48.443+0000', Duration.ThreeHundredSeconds);

        const expectedStartTimeStr = metricTime.start.toString().trim();
        expect(expectedStartTimeStr).to.equal(moment('2018-08-25T02:02:48.443+0000').toDate().toString());

        const expectedEndTimeStr = metricTime.end.toString().trim();
        expect(expectedEndTimeStr).to.equal(moment('2018-08-25T02:07:48.443+0000').toDate().toString());
    });
});