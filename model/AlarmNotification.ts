export interface AlarmStatus {
    alarmName: string;
    oldStateValue: string;
    newStateValue: string;
    stateChangeTime: string;
}

export class AlarmNotification {

    public extractAlarmStatus(event: any): AlarmStatus | null {
        let alarmStatus: AlarmStatus | null = null;

        if (event.Records) {
            for (let record of event.Records) {

                if (record.Sns) {
                    const message: any = JSON.parse(record.Sns.Message);

                    if (message.AlarmName) {
                        alarmStatus = {
                            alarmName: message.AlarmName,
                            oldStateValue: message.OldStateValue,
                            newStateValue: message.NewStateValue,
                            stateChangeTime: message.StateChangeTime
                        };
    
                        break;
                    }
                }
            }
        }

        return alarmStatus;
    }
}