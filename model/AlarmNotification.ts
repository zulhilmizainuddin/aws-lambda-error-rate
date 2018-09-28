import {SNSEvent} from 'aws-lambda';

export interface AlarmStatus {
    alarmName: string;
    oldStateValue: string;
    newStateValue: string;
    stateChangeTime: string;
    erroredFunctionName: string;
}

export class AlarmNotification {

    public extractAlarmStatus(snsEvent: SNSEvent): AlarmStatus | null {
        let alarmStatus: AlarmStatus | null = null;

        if (snsEvent.Records) {
            for (let record of snsEvent.Records) {

                if (record.Sns) {
                    const message: any = JSON.parse(record.Sns.Message);

                    if (message.AlarmName) {
                        
                        let erroredFunctionName: string = '';
                        for (let dimension of message.Trigger.Dimensions)          {
                            if (dimension.name === 'FunctionName') {
                                erroredFunctionName = dimension.value;

                                break;
                            }
                        }

                        alarmStatus = {
                            alarmName: message.AlarmName,
                            oldStateValue: message.OldStateValue,
                            newStateValue: message.NewStateValue,
                            stateChangeTime: message.StateChangeTime,
                            erroredFunctionName: erroredFunctionName
                        };
    
                        break;
                    }
                }
            }
        }

        return alarmStatus;
    }
}