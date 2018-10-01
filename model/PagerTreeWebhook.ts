import request = require('request-promise-native');

import {IncidentWebhook} from "./IncidentWebhook";

export class PagerTreeWebhook extends IncidentWebhook {
    public constructor(protected url: string) {
        super(url);
    }

    public async createIncident(id: string, title: string, description: string): Promise<boolean> {
        const isSuccess: boolean = await this.postCreateIncident(id, title, description);

        return isSuccess;
    }

    private async postCreateIncident(id: string, title: string, description: string): Promise<boolean> {

        const options: any = {
            method: 'POST',
            uri: this.url,
            body: {
                event_type: 'create',
                Id: id,
                Title: title,
                Description: description
            },
            json: true
        };

        await request(options);

        return true;
    }

    public async resolveIncident(id: string): Promise<boolean> {
        const isSuccess: boolean = await this.postResolveIncident(id);

        return isSuccess;
    }

    private async postResolveIncident(id: string): Promise<boolean> {

        const options: any = {
            method: 'POST',
            uri: this.url,
            body: {
                event_type: 'resolve',
                Id: id
            },
            json: true
        };

        await request(options);

        return true;
    }    
}