import AWS = require('aws-sdk');
import CloudWatch = require('aws-sdk/clients/cloudwatch');

import {MetricTimeRange} from './MetricTimeRange';
import {Period} from '../enum/Period';

export interface MetricErrorRate {
    timestamp: Date;
    errorRate: number;
}

export class MetricData {
    public constructor() {
        AWS.config.update({region: process.env.AWS_DEFAULT_REGION});
    }

    public async getMetricErrorRates(functionName: string, metricTimeRange: MetricTimeRange, period: Period): Promise<MetricErrorRate[]> {
        const param: CloudWatch.GetMetricDataInput = this.buildMetricDataInput(functionName, metricTimeRange, period);

        const data: CloudWatch.GetMetricDataOutput = await this.getMetricDataOutput(param);

        const metricErrorRates: MetricErrorRate[] = [];
        if (data.MetricDataResults) {
            for (let result of data.MetricDataResults) {
                
                if (result.Id === 'errorrate') {
                    if (result.Timestamps && result.Values) {

                        for (let i = 0; i < result.Timestamps.length; i++) {
                            metricErrorRates.push({
                                timestamp: result.Timestamps[i],
                                errorRate: result.Values[i]
                            });
                        }

                        break;
                    }
                }
            }
        }

        return metricErrorRates;
    }

    private getMetricDataOutput(metricInput: CloudWatch.GetMetricDataInput): Promise<CloudWatch.GetMetricDataOutput> {
        return new Promise<CloudWatch.GetMetricDataOutput>((resolve, reject) => {

            const cloudWatch = new CloudWatch();
            cloudWatch.getMetricData(metricInput, (err, data: CloudWatch.GetMetricDataOutput) => {

                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(data);
            })
        });
    }

    private buildMetricDataInput(functionName: string, metricTimeRange: MetricTimeRange, period: Period): CloudWatch.GetMetricDataInput {
        const getMetricDataInput: CloudWatch.GetMetricDataInput = {
            MetricDataQueries: [
                {
                    Id: 'errorrate',
                    Expression: 'errors / invocations * 100'
                },
                {
                    Id: 'errors',
                    MetricStat: {
                        Metric: {
                            Namespace: 'AWS/Lambda',
                            MetricName: 'Errors',
                            Dimensions: [
                                {
                                    Name: 'FunctionName',
                                    Value: functionName
                                }
                            ]
                        },
                        Period: period,
                        Stat: 'Sum',
                        Unit: 'Count'
                    }
                },
                {
                    Id: 'invocations',
                    MetricStat: {
                        Metric: {
                            Namespace: 'AWS/Lambda',
                            MetricName: 'Invocations',
                            Dimensions: [
                                {
                                    Name: 'FunctionName',
                                    Value: functionName
                                }
                            ]
                        },
                        Period: period,
                        Stat: 'Sum',
                        Unit: 'Count'
                    }
                }
            ],
            StartTime: metricTimeRange.start,
            EndTime: metricTimeRange.end,
            ScanBy: 'TimestampAscending'
        };

        return getMetricDataInput;
    }
}