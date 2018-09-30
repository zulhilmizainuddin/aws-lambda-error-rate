import {MetricErrorRate} from './MetricData';

import {Duration} from '../enum/Duration';
import {Period} from '../enum/Period';
import {Threshold} from '../enum/Threshold';

export class ErrorRateThreshold {
    public isCrossedDegenerationThreshold(metricErrorRates: MetricErrorRate[], threshold: Threshold, duration: Duration, period: Period): boolean {

        let count: number = 0;
        for (let metricErrorRate of metricErrorRates) {
            if (metricErrorRate.errorRate >= threshold) {
                count++;
            }
        }

        const thresholdCountToCross: number = duration / period;

        const isCrossed: boolean = count === thresholdCountToCross ? true : false;

        return isCrossed;
    }

    public isCrossedRecoveryThreshold(metricErrorRates: MetricErrorRate[], threshold: Threshold): boolean {

        let count: number = 0;
        for (let metricErrorRate of metricErrorRates) {
            if (metricErrorRate.errorRate >= threshold) {
                count++;
            }
        }

        const isCrossed: boolean = count === 0 ? true : false;

        return isCrossed;
    }
}