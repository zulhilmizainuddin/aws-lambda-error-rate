export class EventRuleArnHelper {
    public static extractRuleName(eventRuleArn: string): string {
        const regex = /^arn:aws:events:[a-z0-9-]+:[0-9]+:rule\/(.+)$/;

        let eventRuleName: string = '';

        const result: any[] | null = regex.exec(eventRuleArn);
        if (result) {
            eventRuleName = result[1];
        }

        return eventRuleName;
    }
}