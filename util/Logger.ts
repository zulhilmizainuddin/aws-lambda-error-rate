export class Logger {
    public static log(label: string, message: string | boolean): void {
        console.log(`${label}:`);
        console.log(message);
    }

    public static logJson(label: string, json: object): void {
        console.log(`${label}:`);
        console.log(JSON.stringify(json));
    }
}