export abstract class IncidentWebhook {
    public constructor(protected url: string) { }

    public abstract createIncident(id: string, title: string, description: string): Promise<boolean>;
    public abstract resolveIncident(id: string): Promise<boolean>;
}