import AWS = require('aws-sdk');
import CloudWatch = require('aws-sdk/clients/cloudwatch');

export class AlarmState {
    public constructor() {
        AWS.config.update({region: process.env.AWS_DEFAULT_REGION});
    }

    public async getState(alarmName: string): Promise<string> {
        const describeAlarmInput: CloudWatch.DescribeAlarmsInput = this.buildDescribeAlarmInput(alarmName);

        const describeAlarmOutput: CloudWatch.DescribeAlarmsOutput = await this.getDescribeAlarmOutput(describeAlarmInput);

        let stateValue: string = '';
        if (describeAlarmOutput.MetricAlarms) {
            for (let metricAlarm of describeAlarmOutput.MetricAlarms) {

                if (metricAlarm.AlarmName === alarmName) {
                    stateValue = metricAlarm.StateValue || '';

                    break;
                }
            }
        }

        return stateValue;
    }

    private getDescribeAlarmOutput(describeAlarmInput: CloudWatch.DescribeAlarmsInput): Promise<CloudWatch.DescribeAlarmsOutput> {
        return new Promise<CloudWatch.DescribeAlarmsOutput>((resolve, reject) => {

            const cloudWatch = new CloudWatch();
            cloudWatch.describeAlarms(describeAlarmInput, (err, data: CloudWatch.DescribeAlarmsOutput) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(data);
            })
        });
    }

    private buildDescribeAlarmInput(alarmName: string): CloudWatch.DescribeAlarmsInput {
        const describeAlarmInput: CloudWatch.DescribeAlarmsInput = {
            AlarmNames: [alarmName]
        }

        return describeAlarmInput;
    }
}