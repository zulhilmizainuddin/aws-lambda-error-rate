import {expect} from 'chai';

import {Webhook, WebhookHelper} from '../../enum/Webhook';

describe('Webhook', () => {
    it('should get PagerTree webhook', () => {
        const value: string = 'PagerTree';

        const webhook: Webhook = WebhookHelper.getWebhook(value);

        expect(webhook).to.equal(Webhook.PagerTree);
    });
});