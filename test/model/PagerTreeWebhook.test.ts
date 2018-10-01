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

        url = 'https://api.pagertree.com/integration/integrationIdHere';
        id = '2018-09-27T07:14:44.299+0000';
        title = 'LambdaErrorAlarm';
        description = 'Error percentage > 1% for at least 300 seconds';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should create incident', async () => {
        const pagerTreeWebhook = new PagerTreeWebhook(url);
        sandbox.stub(PagerTreeWebhook.prototype, 'postCreateIncident').callsFake(() => {
            return true;
        });

        const isSuccess: boolean = await pagerTreeWebhook.createIncident(id, title, description);

        expect(isSuccess).to.be.true;
    });

    it('should resolve incident', async () => {
        const pagerTreeWebhook = new PagerTreeWebhook(url);
        sandbox.stub(PagerTreeWebhook.prototype, 'postResolveIncident').callsFake(() => {
            return true;
        });

        const isSuccess: boolean = await pagerTreeWebhook.resolveIncident(id);

        expect(isSuccess).to.be.true;
    });
});