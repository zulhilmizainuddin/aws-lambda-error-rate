import request = require('request-promise-native');

import {IncidentWebhook} from "./IncidentWebhook";

export class PagerTreeWebhook implements IncidentWebhook {
    public constructor(private url: string, private title: string, private description?: string) { }

    public async createIncident(): Promise<boolean> {
        const isSuccess: boolean = await this.postCreateIncident();

        return isSuccess;
    }

    private async postCreateIncident(): Promise<boolean> {

        const options: any = {
            method: 'POST',
            uri: this.url,
            body: {
                event_type: 'create',
                Id: this.title,
                Title: this.title,
                Description: this.description
            },
            json: true
        };

        await request(options);

        return true;
    }

    public async resolveIncident(): Promise<boolean> {
        const isSuccess: boolean = await this.postResolveIncident();

        return isSuccess;
    }

    private async postResolveIncident(): Promise<boolean> {

        const options: any = {
            method: 'POST',
            uri: this.url,
            body: {
                event_type: 'resolve',
                Id: this.title
            },
            json: true
        };

        await request(options);

        return true;
    }
}