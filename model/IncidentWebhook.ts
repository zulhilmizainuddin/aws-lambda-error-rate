export interface IncidentWebhook {
    createIncident(): Promise<boolean>;
    resolveIncident(): Promise<boolean>;
}