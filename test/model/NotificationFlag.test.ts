import {expect} from 'chai';

import * as sinon from 'sinon';

import {NotificationFlag} from '../../model/NotificationFlag';

describe('NotificationFlag', () => {
    let sandbox: any;
    let bucketName: string;
    let alarmName: string;

    let putObjectResult: any;
    let getObjectResult: any;
    let deleteObjectResult: any;

    before(() => {
        sandbox = sinon.createSandbox();

        bucketName = 'aws-lambda-error-rate-de-errorratenotificationfla-ea2sgss74yj3';
        alarmName = 'LambdaErrorAlarm';

        putObjectResult = {
            "ETag": "\"d41d8cd98f00b204e9800998ecf8427e\""
        };

        getObjectResult = {
            "AcceptRanges":"bytes",
            "LastModified":"2018-09-24T06:40:31.000Z",
            "ContentLength":0,
            "ETag":"\"d41d8cd98f00b204e9800998ecf8427e\"",
            "ContentType":"application/octet-stream",
            "Metadata":{
        
            },
            "Body":{
                "type":"Buffer",
                "data":[
        
                ]
            }
        };

        deleteObjectResult = {};
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should put flag to S3 bucket', async () => {
        const notificationFlag = new NotificationFlag();
        sandbox.stub(NotificationFlag.prototype, 'putObject').callsFake(() => {
            return true;
        });

        const isPutFlagSuccess: boolean = await notificationFlag.putFlag(bucketName, alarmName);

        expect(isPutFlagSuccess).to.be.true;
    });

    it('should get flag from S3 bucket', async () => {
        const notificationFlag = new NotificationFlag();
        sandbox.stub(NotificationFlag.prototype, 'getObject').callsFake(() => {
            return true;
        });

        const isGetFlagSuccess: boolean = await notificationFlag.getFlag(bucketName, alarmName);

        expect(isGetFlagSuccess).to.be.true;
    });

    it('should delete flag from S3 bucket', async () => {
        const notificationFlag = new NotificationFlag();
        sandbox.stub(NotificationFlag.prototype, 'deleteObject').callsFake(() => {
            return true;
        });

        const isDeleteFlagSuccess: boolean = await notificationFlag.deleteFlag(bucketName, alarmName);

        expect(isDeleteFlagSuccess).to.be.true;
    });
});