import moment from 'moment';

export interface MetricTimeRange {
    start: Date;
    end: Date;
}

export class MetricTimeRangeHelper {
    public static calculate(stateTimeChange: string, durationInSeconds: number): MetricTimeRange {
        const parsedMoment: moment.Moment = moment(stateTimeChange).utc();

        const endTime: moment.Moment = parsedMoment.clone().add(1, 'seconds');
        const startTime: moment.Moment = endTime.clone().subtract(durationInSeconds, 'seconds');

        const metricTimeRange: MetricTimeRange = {
            start: startTime.toDate(),
            end: endTime.toDate()
        };

        return metricTimeRange;
    }
}