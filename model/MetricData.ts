import AWS = require('aws-sdk');
import CloudWatch = require('aws-sdk/clients/cloudwatch');

import {MetricTimeRange} from './MetricTimeRange';

export interface MetricErrorRate {
    timestamp: Date;
    errorRate: number;
}

export class MetricData {
    public constructor() {
        AWS.config.update({region: process.env.AWS_DEFAULT_REGION});
    }

    public async getMetricErrorRates(functionName: string, metricTimeRange: MetricTimeRange, periodInSeconds: number): Promise<MetricErrorRate[]> {
        return new Promise<MetricErrorRate[]>(async (resolve, reject) => {
            const param: CloudWatch.GetMetricDataInput = this.buildMetricDataInput(functionName, metricTimeRange, periodInSeconds);

            const data: CloudWatch.GetMetricDataOutput = await this.getMetricDataOutput(param);

            if (data.MetricDataResults) {
                for (let result of data.MetricDataResults) {
                    
                    if (result.Id === 'errorrate') {
                        if (result.Timestamps && result.Values) {

                            const metricErrorRates: MetricErrorRate[] = [];
                            for (let i = 0; i < result.Timestamps.length; i++) {
                                metricErrorRates.push({
                                    timestamp: result.Timestamps[i],
                                    errorRate: result.Values[i]
                                });
                            }

                            resolve(metricErrorRates);
                        } else {
                            reject(new Error('errorrate Timestamps or Values error'));
                        }
                    }
                }
            } else {
                reject(new Error('Empty MetricDataResults'));
            }
        });
    }

    public async getMetricDataOutput(metricInput: CloudWatch.GetMetricDataInput): Promise<CloudWatch.GetMetricDataOutput> {
        return new Promise<CloudWatch.GetMetricDataOutput>((resolve, reject) => {

            const cloudWatch = new CloudWatch();
            cloudWatch.getMetricData(metricInput, (err, data: CloudWatch.GetMetricDataOutput) => {

                if (err) {
                    console.log(err);

                    reject(err);
                }

                resolve(data);
            })
        });
    }

    private buildMetricDataInput(functionName: string, metricTimeRange: MetricTimeRange, periodInSeconds: number): CloudWatch.GetMetricDataInput {
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
                        Period: periodInSeconds,
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
                        Period: periodInSeconds,
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