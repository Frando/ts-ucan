import { DidableKey, Encodings, ExportableKey } from "@ucans/core";
import { AvailableCryptoKeyPair, PrivateKeyJwk } from "../types.js";
export declare class EcdsaKeypair implements DidableKey, ExportableKey {
    jwtAlg: string;
    private publicKey;
    private keypair;
    private exportable;
    constructor(keypair: AvailableCryptoKeyPair, publicKey: Uint8Array, exportable: boolean);
    static create(params?: {
        exportable?: boolean;
    }): Promise<EcdsaKeypair>;
    static importFromJwk(jwk: PrivateKeyJwk, params?: {
        exportable?: boolean;
    }): Promise<EcdsaKeypair>;
    did(): string;
    sign(msg: Uint8Array): Promise<Uint8Array>;
    export(format?: Encodings): Promise<string>;
}
export default EcdsaKeypair;
