import {expect} from 'chai';

import * as sinon from 'sinon';

import {IncidentFlag} from '../../model/IncidentFlag';

describe('IncidentFlag', () => {
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
        const incidentFlag = new IncidentFlag();
        sandbox.stub(IncidentFlag.prototype, 'putObject').callsFake(() => {
            return true;
        });

        const isPutFlagSuccess: boolean = await incidentFlag.putFlag(bucketName, alarmName);

        expect(isPutFlagSuccess).to.be.true;
    });

    it('should get flag from S3 bucket', async () => {
        const incidentFlag = new IncidentFlag();
        sandbox.stub(IncidentFlag.prototype, 'getObject').callsFake(() => {
            return true;
        });

        const isGetFlagSuccess: boolean = await incidentFlag.getFlag(bucketName, alarmName);

        expect(isGetFlagSuccess).to.be.true;
    });

    it('should delete flag from S3 bucket', async () => {
        const incidentFlag = new IncidentFlag();
        sandbox.stub(IncidentFlag.prototype, 'deleteObject').callsFake(() => {
            return true;
        });

        const isDeleteFlagSuccess: boolean = await incidentFlag.deleteFlag(bucketName, alarmName);

        expect(isDeleteFlagSuccess).to.be.true;
    });
});