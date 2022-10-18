import { AvailableCryptoKeyPair } from "../types.js";
import { DidableKey, Encodings, ExportableKey } from "@ucans/core";
export declare class RsaKeypair implements DidableKey, ExportableKey {
    jwtAlg: string;
    private publicKey;
    private keypair;
    private exportable;
    constructor(keypair: AvailableCryptoKeyPair, publicKey: Uint8Array, exportable: boolean);
    static create(params?: {
        size?: number;
        exportable?: boolean;
    }): Promise<RsaKeypair>;
    did(): string;
    sign(msg: Uint8Array): Promise<Uint8Array>;
    export(format?: Encodings): Promise<string>;
}
export default RsaKeypair;
