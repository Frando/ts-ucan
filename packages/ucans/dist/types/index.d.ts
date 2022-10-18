import * as core from "@ucans/core";
export * from "@ucans/core";
export * from "@ucans/default-plugins";
export declare const build: (params: {
    issuer: core.DidableKey;
    audience: string;
    capabilities?: core.capability.Capability[] | undefined;
    lifetimeInSeconds?: number | undefined;
    expiration?: number | undefined;
    notBefore?: number | undefined;
    facts?: core.Fact[] | undefined;
    proofs?: string[] | undefined;
    addNonce?: boolean | undefined;
}) => Promise<core.Ucan<string>>;
export declare const sign: (payload: core.UcanPayload<string>, jwtAlg: string, signFn: (data: Uint8Array) => Promise<Uint8Array>) => Promise<core.Ucan<string>>;
export declare const signWithKeypair: (payload: core.UcanPayload<string>, keypair: core.Keypair) => Promise<core.Ucan<string>>;
export declare const validate: (encodedUcan: string, opts?: Partial<core.ValidateOptions> | undefined) => Promise<core.Ucan<string>>;
export declare const validateProofs: (ucan: core.Ucan<string>, opts?: Partial<core.ValidateProofsOptions> | undefined) => AsyncIterable<Error | core.Ucan<string>>;
export declare const verify: (ucan: string, options: core.VerifyOptions) => Promise<core.Result<core.Verification[], Error[]>>;
export declare const Builder: {
    new <State extends Partial<core.BuildableState>>(state: State, defaultable: core.DefaultableState): core.BuilderI<State>;
    create(): core.BuilderI<Record<string, never>>;
};
export declare const Store: {
    new (knownSemantics: core.DelegationSemantics, index: core.IndexByAudience): core.StoreI;
    empty(knownSemantics: core.DelegationSemantics): core.StoreI;
    fromTokens(knownSemantics: core.DelegationSemantics, tokens: Iterable<string> | AsyncIterable<string>): Promise<core.StoreI>;
};
export declare const delegationChains: (semantics: core.DelegationSemantics, ucan: core.Ucan<string>, isRevoked?: ((ucan: core.Ucan<string>) => Promise<boolean>) | undefined) => AsyncIterable<Error | core.DelegationChain>;
