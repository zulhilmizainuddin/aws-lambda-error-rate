import moment from 'moment';

import {Duration} from '../enum/Duration';

export interface MetricTimeRange {
    start: Date;
    end: Date;
}

export class MetricTimeRangeHelper {
    public static calculate(stateTimeChange: string, duration: Duration): MetricTimeRange {
        const parsedMoment: moment.Moment = moment(stateTimeChange).utc();

        const endTime: moment.Moment = parsedMoment.clone().add(1, 'seconds');
        const startTime: moment.Moment = endTime.clone().subtract(duration, 'seconds');

        const metricTimeRange: MetricTimeRange = {
            start: startTime.toDate(),
            end: endTime.toDate()
        };

        return metricTimeRange;
    }
}