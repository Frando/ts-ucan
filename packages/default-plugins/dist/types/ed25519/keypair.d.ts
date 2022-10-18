import { DidableKey, Encodings, ExportableKey } from "@ucans/core";
export declare class EdKeypair implements DidableKey, ExportableKey {
    jwtAlg: string;
    private secretKey;
    private publicKey;
    private exportable;
    constructor(secretKey: Uint8Array, publicKey: Uint8Array, exportable: boolean);
    static create(params?: {
        exportable: boolean;
    }): Promise<EdKeypair>;
    static fromSecretKey(key: string, params?: {
        format?: Encodings;
        exportable?: boolean;
    }): EdKeypair;
    did(): string;
    sign(msg: Uint8Array): Promise<Uint8Array>;
    export(format?: Encodings): Promise<string>;
}
export default EdKeypair;
