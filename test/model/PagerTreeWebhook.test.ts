import {expect} from 'chai';

import * as sinon from 'sinon';

import {PagerTreeWebhook} from '../../model/PagerTreeWebhook';

describe('PagerTreeWebhook', () => {
    let sandbox: any;

    let url: string;
    let id: string;
    let title: string;
    let description: string;

    before(() => {
        sandbox = sinon.createSandbox();

        url = 'https://api.pagertree.com/integration/int_Hk50sQvKm';
        id = '2018-09-27T07:14:44.299+0000';
        title = 'LambdaErrorAlarm';
        description = 'Error percentage > 1% for at least 300 seconds';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should create incident', async () => {
        const pagerTreeWebhook = new PagerTreeWebhook(url, id, title, description);
        sandbox.stub(PagerTreeWebhook.prototype, 'postCreateIncident').callsFake(() => {
            return true;
        });

        const isSuccess: boolean = await pagerTreeWebhook.createIncident();

        expect(isSuccess).to.be.true;
    });

    it('should resolve incident', async () => {
        const pagerTreeWebhook = new PagerTreeWebhook(url, id);
        sandbox.stub(PagerTreeWebhook.prototype, 'postResolveIncident').callsFake(() => {
            return true;
        });

        const isSuccess: boolean = await pagerTreeWebhook.resolveIncident();

        expect(isSuccess).to.be.true;
    });
});