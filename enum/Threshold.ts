export enum Threshold {
    OnePercent = 1
}

declare type ThresholdType = keyof typeof Threshold;

export class ThresholdHelper {
    public static getThreshold(value: number): Threshold {
        const key: string = Threshold[value];
        const keyType: ThresholdType = key as ThresholdType;

        return Threshold[keyType];
    }
}