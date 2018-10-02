import {expect} from 'chai';

import {ErrorRateThreshold} from '../../model/ErrorRateThreshold';
import {MetricErrorRate} from '../../model/MetricData';

import {ErrorRateState} from '../../enum/ErrorRateState';
import {Duration} from '../../enum/Duration';
import {Threshold} from '../../enum/Threshold';
import {Period} from '../../enum/Period';

describe('ErrorRateThreshold', () => {
    it('should evaluate degeneration state', () => {
        let metricErrorRates: MetricErrorRate[] = [
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
            }
        ];

        let errorRateThreshold = new ErrorRateThreshold(Threshold.OnePercent);
        let errorRateState: ErrorRateState = errorRateThreshold.getDegenerationState(metricErrorRates, Duration.ThreeHundredSeconds, Period.SixtySeconds);

        expect(errorRateState).to.equal(ErrorRateState.Degeneration);

        metricErrorRates = [
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

        errorRateThreshold = new ErrorRateThreshold(Threshold.OnePercent);
        errorRateState = errorRateThreshold.getDegenerationState(metricErrorRates, Duration.ThreeHundredSeconds, Period.SixtySeconds);
        
        expect(errorRateState).to.equal(ErrorRateState.ThresholdCrossed);
    });

    it('should evaluate recovery state', () => {
        let metricErrorRates: MetricErrorRate[] = [
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
                "errorRate": 0
            }
        ];

        let errorRateThreshold = new ErrorRateThreshold(Threshold.OnePercent);
        let errorRateState: ErrorRateState = errorRateThreshold.getRecoveryState(metricErrorRates);

        expect(errorRateState).to.equal(ErrorRateState.Recovery);

        metricErrorRates = [
            {
                "timestamp": new Date("2018-09-16T00:05:00.000Z"),
                "errorRate": 0
            },
            {
                "timestamp": new Date("2018-09-16T00:06:00.000Z"),
                "errorRate": 0
            }
        ];

        errorRateThreshold = new ErrorRateThreshold(Threshold.OnePercent);
        errorRateState = errorRateThreshold.getRecoveryState(metricErrorRates);

        expect(errorRateState).to.equal(ErrorRateState.ThresholdCrossed);
    });
});