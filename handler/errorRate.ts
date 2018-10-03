import {SNSEvent, Context, Callback} from 'aws-lambda';

import {AlarmState} from '../model/AlarmState';
import {AlarmEvent, AlarmNotification} from '../model/AlarmNotification';
import {EnvironmentVariable} from '../model/EnvironmentVariable';
import {ErrorRateThreshold} from '../model/ErrorRateThreshold';
import {EventScheduler} from '../model/EventScheduler';
import {IncidentFlag} from '../model/IncidentFlag';
import {IncidentWebhook} from '../model/IncidentWebhook';
import {IncidentWebhookFactory} from '../model/IncidentWebhookFactory';
import {MetricErrorRate, MetricData} from '../model/MetricData';
import {MetricTime, MetricTimeRange} from '../model/MetricTimeRange';

import {Duration, DurationHelper} from '../enum/Duration';
import {ErrorRateState} from '../enum/ErrorRateState';
import {Period} from '../enum/Period';
import {RateExpression} from '../enum/RateExpression';
import {Threshold, ThresholdHelper} from '../enum/Threshold';
import {Webhook, WebhookHelper} from '../enum/Webhook';

import {Logger} from '../util/Logger';

const envVar: EnvironmentVariable = process.env as any as EnvironmentVariable;

const INCIDENT_DEGENERATION_DURATION: Duration = DurationHelper.getDuration(parseInt(envVar.INCIDENT_DEGENERATION_DURATION));
const INCIDENT_RECOVERY_DURATION: Duration = DurationHelper.getDuration(parseInt(envVar.INCIDENT_RECOVERY_DURATION));

const INCIDENT_THRESHOLD_PERCENTAGE: Threshold = ThresholdHelper.getThreshold(parseInt(envVar.INCIDENT_THRESHOLD_PERCENTAGE));

const INCIDENT_FLAG_BUCKET_NAME: string = envVar.INCIDENT_FLAG_BUCKET_NAME;

const INCIDENT_INTEGRATION_URL: string = envVar.INCIDENT_INTEGRATION_URL;
const INCIDENT_INTEGRATION_WEBHOOK: Webhook = WebhookHelper.getWebhook(envVar.INCIDENT_INTEGRATION_WEBHOOK);

module.exports.errorRate = async (event: any, context: Context, callback: Callback) => {

    try {
        Logger.logJson('event', event);
        Logger.logJson('context', context);

        if (event.Records) {
            Logger.log('eventType', 'SNSEvent');

            snsEventHandler(event, context);

        } else {
            Logger.log('eventType', 'AlarmEvent');

            alarmEventHandler(event, context);
        }

        return callback(null, {
            message: 'errorRate function executed successfully',
            event
        });

    } catch (ex) {
        return callback(ex);
    }
};

const snsEventHandler = async (snsEvent: SNSEvent, context: Context) => {

    const alarmNotification = new AlarmNotification();
    const alarmEvent: AlarmEvent | null = alarmNotification.extractAlarmEvent(snsEvent);

    Logger.logJson('alarmEvent', alarmEvent);

    if (!alarmEvent) {
        throw new Error('Failed to extract alarm event');
    }

    const eventScheduler = new EventScheduler();
    const isCreateEventSuccess: boolean = await eventScheduler.createEvent(alarmEvent, RateExpression.OneMinute, context.invokedFunctionArn, context.functionName);

    Logger.log('isCreateEventSuccess', isCreateEventSuccess);

    if (!isCreateEventSuccess) {
        throw new Error('Failed to create scheduled event');
    }
};

const alarmEventHandler = async (alarmEvent: AlarmEvent, context: Context) => {

    const alarmState = new AlarmState();
    const activeAlarmState: string = await alarmState.getState(alarmEvent.alarmName);

    Logger.log('activeAlarmState', activeAlarmState);

    if (activeAlarmState === 'ALARM') {
        alarmStateAlarmHandler(alarmEvent, context);
    } else {
        alarmStateOkHandler(alarmEvent, context);
    }
};

const alarmStateAlarmHandler = async (alarmEvent: AlarmEvent, context: Context) => {

    const incidentFlag = new IncidentFlag();
    const isIncidentFlagExist: boolean = await incidentFlag.getFlag(INCIDENT_FLAG_BUCKET_NAME, alarmEvent.alarmName);

    Logger.log('isIncidentFlagExist', isIncidentFlagExist);

    if (!isIncidentFlagExist) {
        Logger.log('incidentHandler', 'preIncidentHandler');

        preIncidentHandler(alarmEvent, context);
    } else {
        Logger.log('incidentHandler', 'postIncidentHandler');

        postIncidentHandler(alarmEvent, context);
    }
};

const preIncidentHandler = async (alarmEvent: AlarmEvent, context: Context) => {
    const metricTimeRange = new MetricTimeRange();
    const metricTime: MetricTime = metricTimeRange.calculate(new Date().toISOString(), INCIDENT_DEGENERATION_DURATION);

    Logger.logJson('metricTime', metricTime);

    const metricData = new MetricData();
    const metricErrorRates: MetricErrorRate[] = await metricData.getMetricErrorRates(alarmEvent.erroredFunctionName, metricTime, Period.SixtySeconds);

    Logger.logJson('metricErrorRates', metricErrorRates);

    const errorRateThreshold = new ErrorRateThreshold(INCIDENT_THRESHOLD_PERCENTAGE);
    const errorRateState: ErrorRateState = errorRateThreshold.getDegenerationState(metricErrorRates, INCIDENT_DEGENERATION_DURATION, Period.SixtySeconds);

    Logger.log('errorRateState', errorRateState);

    if (errorRateState === ErrorRateState.ThresholdCrossed) {
        const incidentWebhook: IncidentWebhook = IncidentWebhookFactory.getIncidentWebhook(INCIDENT_INTEGRATION_WEBHOOK, INCIDENT_INTEGRATION_URL);
        const isCreateIncidentSuccess: boolean =
            await incidentWebhook.createIncident(
                alarmEvent.stateChangeTime,
                alarmEvent.alarmName,
                `Error percentage > ${INCIDENT_THRESHOLD_PERCENTAGE}% for at least ${INCIDENT_DEGENERATION_DURATION} seconds`);

        Logger.log('isCreateIncidentSuccess', isCreateIncidentSuccess);

        if (!isCreateIncidentSuccess) {
            throw new Error('Failed to create incident');
        }

        const incidentFlag = new IncidentFlag();
        const isPutIncidentFlagSuccess: boolean = await incidentFlag.putFlag(INCIDENT_FLAG_BUCKET_NAME, alarmEvent.alarmName);

        Logger.log('isPutIncidentFlagSuccess', isPutIncidentFlagSuccess);

        if (!isPutIncidentFlagSuccess) {
            throw new Error('Failed to put incident flag to bucket');
        }
    }
};

const postIncidentHandler = async (alarmEvent: AlarmEvent, context: Context) => {
    const metricTimeRange = new MetricTimeRange();
    const metricTime: MetricTime = metricTimeRange.calculate(new Date().toISOString(), INCIDENT_RECOVERY_DURATION);

    Logger.logJson('metricTime', metricTime);

    const metricData = new MetricData();
    const metricErrorRates: MetricErrorRate[] = await metricData.getMetricErrorRates(alarmEvent.erroredFunctionName, metricTime, Period.SixtySeconds);

    Logger.logJson('metricErrorRates', metricErrorRates);

    const errorRateThreshold = new ErrorRateThreshold(INCIDENT_THRESHOLD_PERCENTAGE);
    const errorRateState: ErrorRateState = errorRateThreshold.getRecoveryState(metricErrorRates, INCIDENT_RECOVERY_DURATION, Period.SixtySeconds);

    Logger.log('errorRateState', errorRateState);

    if (errorRateState === ErrorRateState.Recovered) {
        const incidentWebhook: IncidentWebhook = IncidentWebhookFactory.getIncidentWebhook(INCIDENT_INTEGRATION_WEBHOOK, INCIDENT_INTEGRATION_URL);
        const isResolveIncidentSuccess: boolean = await incidentWebhook.resolveIncident(alarmEvent.stateChangeTime);

        Logger.log('isResolveIncidentSuccess', isResolveIncidentSuccess);

        if (!isResolveIncidentSuccess) {
            throw new Error('Failed to resolve incident');
        }

        const incidentFlag = new IncidentFlag();
        const isDeleteIncidentFlagSuccess: boolean = await incidentFlag.deleteFlag(INCIDENT_FLAG_BUCKET_NAME, alarmEvent.alarmName);

        Logger.log('isDeleteIncidentFlagSuccess', isDeleteIncidentFlagSuccess);

        if (!isDeleteIncidentFlagSuccess) {
            throw new Error('Failed to delete incident flag');
        }

        const eventScheduler = new EventScheduler();
        const isDeleteEventSuccess: boolean = await eventScheduler.deleteEvent(alarmEvent.alarmName, context.functionName);

        Logger.log('isDeleteEventSuccess', isDeleteEventSuccess);

        if (!isDeleteEventSuccess) {
            throw new Error('Failed to delete scheduled event');
        }
    }
};

const alarmStateOkHandler = async (alarmEvent: AlarmEvent, context: Context) => {

    const incidentFlag = new IncidentFlag();
    const isIncidentFlagExist: boolean = await incidentFlag.getFlag(INCIDENT_FLAG_BUCKET_NAME, alarmEvent.alarmName);

    Logger.log('isIncidentFlagExist', isIncidentFlagExist);

    if (isIncidentFlagExist) {
        const incidentWebhook: IncidentWebhook = IncidentWebhookFactory.getIncidentWebhook(INCIDENT_INTEGRATION_WEBHOOK, INCIDENT_INTEGRATION_URL);
        const isResolveIncidentSuccess: boolean = await incidentWebhook.resolveIncident(alarmEvent.stateChangeTime);

        Logger.log('isResolveIncidentSuccess', isResolveIncidentSuccess);

        if (!isResolveIncidentSuccess) {
            throw new Error('Failed to resolve incident');
        }

        const isDeleteIncidentFlagSuccess: boolean = await incidentFlag.deleteFlag(INCIDENT_FLAG_BUCKET_NAME, alarmEvent.alarmName);

        Logger.log('isDeleteIncidentFlagSuccess', isDeleteIncidentFlagSuccess);

        if (!isDeleteIncidentFlagSuccess) {
            throw new Error('Failed to delete incident flag');
        }
    }

    const eventScheduler = new EventScheduler();
    const isDeleteEventSuccess: boolean = await eventScheduler.deleteEvent(alarmEvent.alarmName, context.functionName);

    Logger.log('isDeleteEventSuccess', isDeleteEventSuccess);

    if (!isDeleteEventSuccess) {
        throw new Error('Failed to delete scheduled event');
    }
};