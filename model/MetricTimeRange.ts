import moment from 'moment';

import {Duration} from '../enum/Duration';

export interface MetricTime {
    start: Date;
    end: Date;
}

export class MetricTimeRange {
    public calculate(dateTime: string, duration: Duration): MetricTime {
        const parsedMoment: moment.Moment = moment(dateTime).utc();

        const endTime: moment.Moment = parsedMoment.clone();
        const startTime: moment.Moment = endTime.clone().subtract(duration, 'seconds');

        const metricTime: MetricTime = {
            start: startTime.toDate(),
            end: endTime.toDate()
        };

        return metricTime;
    }
}