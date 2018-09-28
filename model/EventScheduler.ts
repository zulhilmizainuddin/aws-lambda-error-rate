import AWS = require('aws-sdk');
import CloudWatchEvents = require('aws-sdk/clients/cloudwatchevents');
import Lambda = require('aws-sdk/clients/lambda');

import {AlarmStatus} from './AlarmNotification';

import {RateExpression} from '../enum/RateExpression';

export class EventScheduler {
    public constructor() {
        AWS.config.update({region: process.env.AWS_DEFAULT_REGION});
    }

    public async createEvent(alarmStatus: AlarmStatus, rateExpression: RateExpression, functionArn: string, functionName: string): Promise<boolean> {

        const ruleArn: string = await this.putRecurringRule(alarmStatus.alarmName, rateExpression);
        if (!ruleArn) {
            return false;
        }

        const isPutTargetSuccess: boolean = await this.putRecurringRuleTarget(alarmStatus, functionArn, functionName);
        if (!isPutTargetSuccess) {
            return false;
        }

        const isAllowTriggerFunctionSuccess: boolean = await this.addPermissionToTriggerFunction(ruleArn, functionName);
        if (!isAllowTriggerFunctionSuccess) {
            return false;
        }

        return true;
    }

    private putRecurringRule(alarmName: string, rateExpression: RateExpression): Promise<string> {
        return new Promise<string>((resolve, reject) => {

            const putRuleRequest: CloudWatchEvents.PutRuleRequest = {
                Name: alarmName,
                ScheduleExpression: rateExpression,
                State: 'ENABLED'
            };
            
            const cloudWatchEvent = new CloudWatchEvents();
            cloudWatchEvent.putRule(putRuleRequest, (err, data: CloudWatchEvents.PutRuleResponse) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                const ruleArn: string = data.RuleArn || '';

                return resolve(ruleArn);
            });
        });
    }

    private putRecurringRuleTarget(alarmStatus: AlarmStatus, functionArn: string, functionName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            const putTargetsRequest: CloudWatchEvents.PutTargetsRequest = {
                Rule: alarmStatus.alarmName,
                Targets: [
                    {
                        Id: alarmStatus.alarmName,
                        Arn: functionArn,
                        Input: JSON.stringify({
                            alarmStatus: alarmStatus,
                            functionName: functionName
                        })
                    }
                ]
            };

            const cloudWatchEvent = new CloudWatchEvents();
            cloudWatchEvent.putTargets(putTargetsRequest, (err, data: CloudWatchEvents.PutTargetsResponse) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(true);
            });
        });
    }

    private addPermissionToTriggerFunction(ruleArn: string, functionName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            const addPermissionRequest: Lambda.AddPermissionRequest = {
                StatementId: functionName,
                FunctionName: functionName,
                Action: 'lambda:InvokeFunction',
                Principal: 'events.amazonaws.com',
                SourceArn: ruleArn
            };

            const lambda = new Lambda();
            lambda.addPermission(addPermissionRequest, (err, data: Lambda.AddPermissionResponse) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(true);
            })
        });
    }

    public async deleteEvent(alarmName: string, functionName: string): Promise<boolean> {

        const isRemovePermissionToTriggerFunctionSuccess: boolean = await this.removePermissionToTriggerFunction(functionName);
        if (!isRemovePermissionToTriggerFunctionSuccess) {
            return false;
        }

        const isRecurringRuleTargetDeleted: boolean = await this.removeRecurringRuleTarget(alarmName);
        if (!isRecurringRuleTargetDeleted) {
            return false;
        }

        const isRecurringRuleDeleted: boolean = await this.deleteRecurringRule(alarmName);
        if (!isRecurringRuleDeleted) {
            return false;
        }

        return true;
    }

    private deleteRecurringRule(alarmName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            const deleteRuleRequest: CloudWatchEvents.DeleteRuleRequest = {
                Name: alarmName
            };

            const cloudWatchEvent = new CloudWatchEvents();
            cloudWatchEvent.deleteRule(deleteRuleRequest, (err) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(true);
            });
        });
    }

    private removeRecurringRuleTarget(alarmName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            const removeTargetsRequest: CloudWatchEvents.RemoveTargetsRequest = {
                Rule: alarmName,
                Ids: [
                    alarmName
                ]
            };

            const cloudWatchEvent = new CloudWatchEvents();
            cloudWatchEvent.removeTargets(removeTargetsRequest, (err, data: CloudWatchEvents.RemoveTargetsResponse) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(true);
            });
        });
    }

    private removePermissionToTriggerFunction(functionName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            const removePermissionRequest: Lambda.RemovePermissionRequest = {
                FunctionName: functionName,
                StatementId: functionName
            }

            const lambda = new Lambda();
            lambda.removePermission(removePermissionRequest, (err) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(true);
            });
        });
    }
}