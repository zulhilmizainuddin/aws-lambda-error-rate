import {MetricErrorRate} from './MetricData';

import {Duration} from '../enum/Duration';
import {ErrorRateState} from '../enum/ErrorRateState';
import {Period} from '../enum/Period';
import {Threshold} from '../enum/Threshold';

export class ErrorRateThreshold {
    public constructor(private threshold: Threshold) { }

    public getDegenerationState(metricErrorRates: MetricErrorRate[], duration: Duration, period: Period): ErrorRateState {

        let count: number = 0;
        for (let metricErrorRate of metricErrorRates) {
            if (metricErrorRate.errorRate >= this.threshold) {
                count++;
            }
        }

        const thresholdCountToCross: number = duration / period;

        const isCrossed: boolean = count === thresholdCountToCross ? true : false;

        const errorRateState: ErrorRateState = isCrossed ? ErrorRateState.ThresholdCrossed : ErrorRateState.Degeneration;

        return errorRateState;
    }

    public getRecoveryState(metricErrorRates: MetricErrorRate[]): ErrorRateState {

        let count: number = 0;
        for (let metricErrorRate of metricErrorRates) {
            if (metricErrorRate.errorRate >= this.threshold) {
                count++;
            }
        }

        const isCrossed: boolean = count === 0 ? true : false;

        const errorRateState: ErrorRateState = isCrossed ? ErrorRateState.ThresholdCrossed : ErrorRateState.Recovery;

        return errorRateState;
    }
}