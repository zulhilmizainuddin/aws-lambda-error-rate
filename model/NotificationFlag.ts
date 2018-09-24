import AWS = require('aws-sdk');
import S3 = require('aws-sdk/clients/s3');

export class NotificationFlag {
    public constructor() {
        AWS.config.update({region: process.env.AWS_DEFAULT_REGION});
    }

    public async putFlag(bucketName: string, alarmName: string): Promise<boolean> {
        const isPutObjectSuccess: boolean = await this.putObject(bucketName, alarmName);

        return isPutObjectSuccess;
    }

    private putObject(bucketName: string, alarmName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            const putObjectRequest: S3.PutObjectRequest = {
                Bucket: bucketName,
                Key: alarmName
            };

            const s3 = new S3();
            s3.putObject(putObjectRequest, (err, data: S3.PutObjectOutput) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(true);
            })
        });
    }

    public async getFlag(bucketName: string, alarmName: string): Promise<boolean> {
        const isGetObjectSuccess: boolean = await this.getObject(bucketName, alarmName);

        return isGetObjectSuccess;
    }

    private getObject(bucketName: string, alarmName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            const getObjectRequest: S3.GetObjectRequest = {
                Bucket: bucketName,
                Key: alarmName
            };

            const s3 = new S3();
            s3.getObject(getObjectRequest, (err, data: S3.GetObjectOutput) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(true);
            })
        });
    }

    public async deleteFlag(bucketName: string, alarmName: string): Promise<boolean> {
        const isDeleteObjectSuccess: boolean = await this.deleteObject(bucketName, alarmName);

        return isDeleteObjectSuccess;
    }

    private deleteObject(bucketName: string, alarmName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            const deleteObjectRequest: S3.DeleteObjectRequest = {
                Bucket: bucketName,
                Key: alarmName
            };

            const s3 = new S3();
            s3.deleteObject(deleteObjectRequest, (err, data: S3.DeleteObjectOutput) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                resolve(true);
            });
        });
    }
}