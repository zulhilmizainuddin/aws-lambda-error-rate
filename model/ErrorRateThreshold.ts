import {MetricErrorRate} from './MetricData';
import {Threshold} from '../enum/Threshold';

export class ErrorRateThreshold {
    public isExceedThreshold(metricErrorRates: MetricErrorRate[], threshold: Threshold): boolean {

        let count: number = 0;
        for (let metricErrorRate of metricErrorRates) {
            if (metricErrorRate.errorRate > threshold) {
                count++;
            }
        }

        const isExceeded: boolean = count === metricErrorRates.length ? true : false;

        return isExceeded;
    }
}