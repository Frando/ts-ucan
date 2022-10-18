import Plugins from "./plugins.js";
import * as token from "./token.js";
import * as verifyLib from "./verify.js";
import * as attenuation from "./attenuation.js";
export * from "./attenuation.js";
export * from "./builder.js";
export * from "./store.js";
export * from "./token.js";
export * from "./types.js";
export * from "./verify.js";
export * from "./plugins.js";
export * from "./util.js";
export * as capability from "./capability/index.js";
export * as ability from "./capability/ability.js";
export { ResourcePointer, isResourcePointer } from "./capability/resource-pointer.js";
export { Ability, isAbility, Superuser, SUPERUSER } from "./capability/ability.js";
export { Capability, EncodedCapability, isCapability } from "./capability/index.js";
export declare const getPluginInjectedApi: (plugins: Plugins) => {
    build: (params: {
        issuer: import("./types.js").DidableKey;
        audience: string;
        capabilities?: import("./capability/index.js").Capability[] | undefined;
        lifetimeInSeconds?: number | undefined;
        expiration?: number | undefined;
        notBefore?: number | undefined;
        facts?: import("./types.js").Fact[] | undefined;
        proofs?: string[] | undefined;
        addNonce?: boolean | undefined;
    }) => Promise<import("./types.js").Ucan<string>>;
    sign: (payload: import("./types.js").UcanPayload<string>, jwtAlg: string, signFn: (data: Uint8Array) => Promise<Uint8Array>) => Promise<import("./types.js").Ucan<string>>;
    signWithKeypair: (payload: import("./types.js").UcanPayload<string>, keypair: import("./types.js").Keypair) => Promise<import("./types.js").Ucan<string>>;
    validate: (encodedUcan: string, opts?: Partial<token.ValidateOptions> | undefined) => Promise<import("./types.js").Ucan<string>>;
    validateProofs: (ucan: import("./types.js").Ucan<string>, opts?: Partial<token.ValidateProofsOptions> | undefined) => AsyncIterable<Error | import("./types.js").Ucan<string>>;
    verify: (ucan: string, options: verifyLib.VerifyOptions) => Promise<verifyLib.Result<verifyLib.Verification[], Error[]>>;
    delegationChains: (semantics: attenuation.DelegationSemantics, ucan: import("./types.js").Ucan<string>, isRevoked?: (ucan: import("./types.js").Ucan<string>) => Promise<boolean>) => AsyncIterable<Error | attenuation.DelegationChain>;
    Builder: {
        new <State extends Partial<import("./types.js").BuildableState>>(state: State, defaultable: import("./types.js").DefaultableState): import("./types.js").BuilderI<State>;
        create(): import("./types.js").BuilderI<Record<string, never>>;
    };
    Store: {
        new (knownSemantics: attenuation.DelegationSemantics, index: import("./types.js").IndexByAudience): import("./types.js").StoreI;
        empty(knownSemantics: attenuation.DelegationSemantics): import("./types.js").StoreI;
        fromTokens(knownSemantics: attenuation.DelegationSemantics, tokens: Iterable<string> | AsyncIterable<string>): Promise<import("./types.js").StoreI>;
    };
};
