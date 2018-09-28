import {AlarmStatus} from './AlarmNotification';

export interface EventRuleInput {
    alarmStatus: AlarmStatus;
    functionName: string;
}

export class EventRule {
    public extractRuleInput(event: any): EventRuleInput {
        const eventRuleInput: EventRuleInput = {
            alarmStatus: event.alarmStatus,
            functionName: event.functionName
        };

        return eventRuleInput;
    }
}