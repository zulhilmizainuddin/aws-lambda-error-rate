import {IncidentWebhook} from './IncidentWebhook';
import {PagerTreeWebhook} from './PagerTreeWebhook';

import {Webhook} from '../enum/Webhook';

export class IncidentWebhookFactory {
    public static getIncidentWebhook(webhook: Webhook, url: string): IncidentWebhook {
        let incidentWebhook: IncidentWebhook;

        switch(webhook) {
            case Webhook.PagerTree:
                incidentWebhook = new PagerTreeWebhook(url);
                break;
            default:
                incidentWebhook = new PagerTreeWebhook(url);
                break;
        }

        return incidentWebhook;
    }
}