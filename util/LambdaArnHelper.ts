export class LambdaArnHelper {
    public static extractFunctionName(lambdaArn: string): string {
        const regex = /^arn:aws:lambda:[a-z0-9-]+:[0-9]+:function:(.+):[0-9]+$/;

        let functionName: string = '';

        const result: any[] | null = regex.exec(lambdaArn);
        if (result) {
            functionName = result[1];
        }

        return functionName;
    }

    public static extractArnWithoutVersionNumber(lambdaArn: string): string {
        const regex = /^(arn:aws:lambda:[a-z0-9-]+:[0-9]+:function:.+):[0-9]+$/;

        let lambdaArnWithoutVersionNumber: string = '';

        const result: any[] | null = regex.exec(lambdaArn);
        if (result) {
            lambdaArnWithoutVersionNumber = result[1];
        }

        return lambdaArnWithoutVersionNumber;
    }
}