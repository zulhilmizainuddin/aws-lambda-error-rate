import AWS = require('aws-sdk');
import CloudFormation = require('aws-sdk/clients/cloudformation');

export class StackDetail {
    public constructor() {
        AWS.config.update({region: process.env.AWS_DEFAULT_REGION});
    }

    public async getStackOutputs(stackName: string): Promise<{[key: string]: string} | null> {
        let output: {[key: string]: string} | null = null;

        const describeStacksOutput: CloudFormation.DescribeStacksOutput = await this.describeStacks(stackName);
        if (!describeStacksOutput.Stacks) {
            return null;
        }

        for (let stack of describeStacksOutput.Stacks) {
            if (stack.StackName === stackName) {

                output = {};
                for (let stackOutput of stack.Outputs) {
                    output[stackOutput.OutputKey] = stackOutput.OutputValue;
                }

                break;
            }
        }

        return output;
    }

    private describeStacks(stackname: string): Promise<CloudFormation.DescribeStacksOutput> {
        return new Promise<CloudFormation.DescribeStacksOutput>((resolve, reject) => {

            const describeStacksInput: CloudFormation.DescribeStacksInput = {
                StackName: stackname
            };

            const cloudFormation = new CloudFormation();
            cloudFormation.describeStacks(describeStacksInput, (err, data: CloudFormation.DescribeStacksOutput) => {
                if (err) {
                    console.log(err);

                    return reject(err);
                }

                return resolve(data);
            });
        });
    }
}