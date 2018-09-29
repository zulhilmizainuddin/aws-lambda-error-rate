import {APIGatewayEvent, SNSEvent, Context, Callback} from 'aws-lambda';

import {AlarmState} from './model/AlarmState';
import {AlarmStatus, AlarmNotification} from './model/AlarmNotification';
import {ErrorRateThreshold} from './model/ErrorRateThreshold';
import {EventRuleInput} from './model/EventRule';
import {EventScheduler} from './model/EventScheduler';
import {IncidentWebhook} from './model/IncidentWebhook';
import {MetricErrorRate, MetricData} from './model/MetricData';
import {MetricTimeRange, MetricTimeRangeHelper} from './model/MetricTimeRange';
import {NotificationFlag} from './model/NotificationFlag';
import {PagerTreeWebhook} from './model/PagerTreeWebhook';
import {StackDetail} from './model/StackDetail';

import {Duration} from './enum/Duration';
import {Period} from './enum/Period';
import {RateExpression} from './enum/RateExpression';
import {Threshold} from './enum/Threshold';

import {Logger} from './util/Logger';

const STACK_NAME: string = 'aws-lambda-error-rate-dev';
const PAGER_TREE_URL: string = 'https://api.pagertree.com/integration/int_Hk50sQvKm';
const INCIDENT_FLAG_BUCKET_NAME: string = 'aws-lambda-error-rate-de-errorratenotificationfla-ea2sgss74yj3';

module.exports.errorRate = async (event: any, context: Context, callback: Callback) => {

    try {
        Logger.logJson('event', event);
        Logger.logJson('context', context);

        const stackDetail = new StackDetail();
        const stackOutput: { [key: string]: string } | null = await stackDetail.getStackOutputs(STACK_NAME);
        if (!stackOutput) {
            return callback('Failed to get stack outputs');
        }

        if (event.Records) {
            Logger.log('eventType', 'SNSEvent');

            event = event as SNSEvent;

            const alarmNotification = new AlarmNotification();
            const alarmStatus: AlarmStatus | null = alarmNotification.extractAlarmStatus(event);

            Logger.logJson('alarmStatus', alarmStatus);

            if (!alarmStatus) {
                return callback('Failed to extract alarm status');
            }

            const eventScheduler = new EventScheduler();
            const isCreateEventSuccess: boolean = await eventScheduler.createEvent(alarmStatus, RateExpression.OneMinute, context.invokedFunctionArn, context.functionName);

            Logger.log('isCreateEventSuccess', isCreateEventSuccess);

            if (!isCreateEventSuccess) {
                return callback('Failed to create scheduled event');
            }

        } else {
            Logger.log('eventType', 'AlarmStatus');

            const alarmStatus: AlarmStatus = event as AlarmStatus;

            const alarmState = new AlarmState();
            const activeAlarmState: string = await alarmState.getState(alarmStatus.alarmName);

            Logger.log('activeAlarmState', activeAlarmState);

            if (activeAlarmState === 'OK') {
                const notificationFlag = new NotificationFlag();
                const isIncidentFlagExist: boolean = await notificationFlag.getFlag(INCIDENT_FLAG_BUCKET_NAME, alarmStatus.alarmName);

                Logger.log('isIncidentFlagExist', isIncidentFlagExist);

                if (isIncidentFlagExist) {
                    const incidentWebhook: IncidentWebhook = new PagerTreeWebhook(PAGER_TREE_URL, alarmStatus.stateChangeTime);
                    const isResolveIncidentSuccess: boolean = await incidentWebhook.resolveIncident();

                    Logger.log('isResolveIncidentSuccess', isResolveIncidentSuccess);

                    if (!isResolveIncidentSuccess) {
                        return callback('Failed to resolve incident');
                    }

                    const isDeleteIncidentFlagSuccess: boolean = await notificationFlag.deleteFlag(INCIDENT_FLAG_BUCKET_NAME, alarmStatus.alarmName);

                    Logger.log('isDeleteIncidentFlagSuccess', isDeleteIncidentFlagSuccess);

                    if (!isDeleteIncidentFlagSuccess) {
                        return callback('Failed to delete incident flag');
                    }
                }

                const eventScheduler = new EventScheduler();
                const isDeleteEventSuccess: boolean = await eventScheduler.deleteEvent(alarmStatus.alarmName, context.functionName);

                Logger.log('isDeleteEventSuccess', isDeleteEventSuccess);

                if (!isDeleteEventSuccess) {
                    return callback('Failed to delete scheduled event');
                }
            } else {
                const metricTimeRange: MetricTimeRange = MetricTimeRangeHelper.calculate(new Date().toISOString(), Duration.ThreeHundredSeconds);

                Logger.logJson('metricTimeRange', metricTimeRange);

                const metricData = new MetricData();
                const metricErrorRates: MetricErrorRate[] = await metricData.getMetricErrorRates(alarmStatus.erroredFunctionName, metricTimeRange, Period.SixtySeconds);

                Logger.logJson('metricErrorRates', metricErrorRates);

                const errorRateThreshold = new ErrorRateThreshold();
                const isExceedThreshold: boolean = errorRateThreshold.isExceedThreshold(metricErrorRates, Threshold.OnePercent, Duration.ThreeHundredSeconds, Period.SixtySeconds);

                Logger.log('isExceedThreshold', isExceedThreshold);

                if (isExceedThreshold) {

                    const notificationFlag = new NotificationFlag();
                    const isIncidentFlagExist: boolean = await notificationFlag.getFlag(INCIDENT_FLAG_BUCKET_NAME, alarmStatus.alarmName);

                    Logger.log('isIncidentFlagExist', isIncidentFlagExist);

                    if (!isIncidentFlagExist) {
                        const incidentWebhook: IncidentWebhook = new PagerTreeWebhook(
                            PAGER_TREE_URL,
                            alarmStatus.stateChangeTime,
                            alarmStatus.alarmName,
                            `Error percentage > ${Threshold.OnePercent}% for at least ${Duration.ThreeHundredSeconds} seconds`);
    
                        const isCreateIncidentSuccess: boolean = await incidentWebhook.createIncident();
    
                        Logger.log('isCreateIncidentSuccess', isCreateIncidentSuccess);
    
                        if (!isCreateIncidentSuccess) {
                            return callback('Failed to create incident');
                        }

                        const isPutIncidentFlagSuccess: boolean = await notificationFlag.putFlag(INCIDENT_FLAG_BUCKET_NAME, alarmStatus.alarmName);

                        Logger.log('isPutIncidentFlagSuccess', isPutIncidentFlagSuccess);

                        if (!isPutIncidentFlagSuccess) {
                            return callback('Failed to put incident flag to bucket');
                        }
                    }
                }
            }
        }

        const result = {
            message: 'Go Serverless v1.0! Your function executed successfully!',
            event
        };

        return callback(null, result);

    } catch (ex) {
        return callback(ex);
    }
};

module.exports.error = (event: APIGatewayEvent, context: Context, callback: Callback) => {

    const error = new Error('Something went wrong')

    return callback(error);
};