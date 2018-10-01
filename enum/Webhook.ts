export enum Webhook {
    PagerTree = 'PagerTree'
}

declare type WebhookType = keyof typeof Webhook;

export class WebhookHelper {
    public static getWebhook(value: string): Webhook {
        const keyType: WebhookType = value as WebhookType;

        return Webhook[keyType];
    }
}