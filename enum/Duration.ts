export enum Duration {
    OneHundredEightySeconds = 180,
    ThreeHundredSeconds = 300
}

declare type DurationType = keyof typeof Duration;

export class DurationHelper {
    public static getDuration(value: number): Duration {
        const key: string = Duration[value];
        const keyType: DurationType = key as DurationType;

        return Duration[keyType];
    }
}