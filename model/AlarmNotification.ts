import {SNSEvent} from 'aws-lambda';

export interface AlarmEvent {
    alarmName: string;
    oldStateValue: string;
    newStateValue: string;
    stateChangeTime: string;
    erroredFunctionName: string;
}

export class AlarmNotification {

    public extractAlarmEvent(snsEvent: SNSEvent): AlarmEvent | null {
        let alarmEvent: AlarmEvent | null = null;

        for (let record of snsEvent.Records) {

            const message: any = JSON.parse(record.Sns.Message);

            if (message.AlarmName) {
                
                let erroredFunctionName: string = '';
                for (let dimension of message.Trigger.Dimensions)          {
                    if (dimension.name === 'FunctionName') {
                        erroredFunctionName = dimension.value;

                        break;
                    }
                }

                alarmEvent = {
                    alarmName: message.AlarmName,
                    oldStateValue: message.OldStateValue,
                    newStateValue: message.NewStateValue,
                    stateChangeTime: message.StateChangeTime,
                    erroredFunctionName: erroredFunctionName
                };

                break;
            }
        }

        return alarmEvent;
    }
}