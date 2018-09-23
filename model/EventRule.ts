export interface EventRuleInput {
    ruleName: string;
    functionName: string;
}

export class EventRule {
    public extractRuleInput(event: any): EventRuleInput {
        const eventRuleInput: EventRuleInput = {
            ruleName: event.ruleName,
            functionName: event.functionName
        };

        return eventRuleInput;
    }
}