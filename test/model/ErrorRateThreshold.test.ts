import {expect} from 'chai';

import {ErrorRateThreshold} from '../../model/ErrorRateThreshold';
import {MetricErrorRate} from '../../model/MetricData';

import {Duration} from '../../enum/Duration';
import {Threshold} from '../../enum/Threshold';
import {Period} from '../../enum/Period';

describe('ErrorRateThreshold', () => {
    it('should exceed threshold', () => {
        const metricErrorRates: MetricErrorRate[] = [
            {
                "timestamp": new Date("2018-09-16T00:05:00.000Z"),
                "errorRate": 10
            },
            {
                "timestamp": new Date("2018-09-16T00:06:00.000Z"),
                "errorRate": 20
            },
            {
                "timestamp": new Date("2018-09-16T00:07:00.000Z"),
                "errorRate": 30
            },
            {
                "timestamp": new Date("2018-09-16T00:08:00.000Z"),
                "errorRate": 40
            },
            {
                "timestamp": new Date("2018-09-16T00:09:00.000Z"),
                "errorRate": 50
            }
        ];

        const errorRateThreshold = new ErrorRateThreshold();
        const isExceedThreshold: boolean = errorRateThreshold.isExceedThreshold(metricErrorRates, Threshold.OnePercent, Duration.ThreeHundredSeconds, Period.SixtySeconds);

        expect(isExceedThreshold).to.be.true;
    });
});