export interface AlarmStatus {
    alarmName: string;
    oldStateValue: string;
    newStateValue: string;
}

export class AlarmNotification {
    public extractAlarmStatus(notification: any): AlarmStatus {
        const message: any = JSON.parse(notification.Message);

        const alarmStatus: AlarmStatus = {
            alarmName: message.AlarmName,
            oldStateValue: message.OldStateValue,
            newStateValue: message.NewStateValue
        };

        return alarmStatus;
    }
}