export class KeyPairStore {
    private static instance: KeyPairStore;

    private keyPair: {[key: string]: string};

    private constructor() { }

    public static getInstance(keyPair: {[key: string]: string}): KeyPairStore {
        if (!KeyPairStore.instance) {
            KeyPairStore.instance = new KeyPairStore();

            KeyPairStore.instance.keyPair = keyPair;
        }

        return KeyPairStore.instance;
    }

    public getValue(key: string): string {
        return KeyPairStore.instance.keyPair[key];
    }
}