import {expect} from 'chai';

import {IncidentWebhook} from '../../model/IncidentWebhook';
import {IncidentWebhookFactory} from '../../model/IncidentWebhookFactory';
import {PagerTreeWebhook} from '../../model/PagerTreeWebhook';

import {Webhook} from '../../enum/Webhook';

describe('IncidenWebhookFactory', () => {
    it('should get PagerTreeWebhook', () => {
        const url: string = 'https://api.pagertree.com/integration/integrationIdHere';

        const incidentWebhook: IncidentWebhook = IncidentWebhookFactory.getIncidentWebhook(Webhook.PagerTree, url);

        expect(incidentWebhook).to.be.instanceof(PagerTreeWebhook);
    });
});