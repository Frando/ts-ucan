export declare type DidKeyPlugin = {
    prefix: Uint8Array;
    jwtAlg: string;
    verifySignature: (did: string, data: Uint8Array, sig: Uint8Array) => Promise<boolean>;
};
export declare type DidMethodPlugin = {
    checkJwtAlg: (did: string, jwtAlg: string) => boolean;
    verifySignature: (did: string, data: Uint8Array, sig: Uint8Array) => Promise<boolean>;
};
export declare class Plugins {
    keys: DidKeyPlugin[];
    methods: Record<string, DidMethodPlugin>;
    constructor(keys: DidKeyPlugin[], methods: Record<string, DidMethodPlugin>);
    verifyIssuerAlg(did: string, jwtAlg: string): boolean;
    verifySignature(did: string, data: Uint8Array, sig: Uint8Array): Promise<boolean>;
}
export default Plugins;
