import { SemVer } from "./semver.js";
import { SupportedEncodings } from "uint8arrays/util/bases.js";
import { Capability } from "./capability/index.js";
import { DelegationChain, DelegationSemantics } from "./attenuation.js";
export declare type Ucan<Prf = string> = {
    header: UcanHeader;
    payload: UcanPayload<Prf>;
    signedData: string;
    signature: string;
};
export interface UcanParts<Prf = string> {
    header: UcanHeader;
    payload: UcanPayload<Prf>;
}
export declare type UcanHeader = {
    alg: string;
    typ: string;
    ucv: SemVer;
};
export declare type UcanPayload<Prf = string> = {
    iss: string;
    aud: string;
    exp: number;
    nbf?: number;
    nnc?: string;
    att: Array<Capability>;
    fct?: Array<Fact>;
    prf: Array<Prf>;
};
export declare type Fact = Record<string, unknown>;
export interface Didable {
    did: () => string;
}
export interface ExportableKey {
    export: (format?: Encodings) => Promise<string>;
}
export interface Keypair {
    jwtAlg: string;
    sign: (msg: Uint8Array) => Promise<Uint8Array>;
}
export interface DidableKey extends Didable, Keypair {
}
export declare type Encodings = SupportedEncodings;
export interface IndexByAudience {
    [audienceDID: string]: Array<{
        processedUcan: Ucan;
        capabilities: DelegationChain[];
    }>;
}
export interface StoreI {
    add(ucan: Ucan): Promise<void>;
    getByAudience(audience: string): Ucan[];
    findByAudience(audience: string, predicate: (ucan: Ucan) => boolean): Ucan | null;
    findWithCapability(audience: string, requiredCapability: Capability, requiredIssuer: string): Iterable<DelegationChain>;
}
export interface BuildableState {
    issuer: DidableKey;
    audience: string;
    expiration: number;
}
export interface DefaultableState {
    capabilities: Capability[];
    facts: Fact[];
    proofs: Ucan[];
    addNonce: boolean;
    notBefore?: number;
}
export interface CapabilityLookupCapableState {
    issuer: Keypair;
    expiration: number;
}
export interface BuilderI<State extends Partial<BuildableState>> {
    issuedBy(issuer: DidableKey): BuilderI<State & {
        issuer: DidableKey;
    }>;
    toAudience(audience: string): BuilderI<State & {
        audience: string;
    }>;
    withLifetimeInSeconds(seconds: number): BuilderI<State & {
        expiration: number;
    }>;
    withExpiration(expiration: number): BuilderI<State & {
        expiration: number;
    }>;
    withNotBefore(notBeforeTimestamp: number): BuilderI<State>;
    withFact(fact: Fact): BuilderI<State>;
    withFact(fact: Fact, ...facts: Fact[]): BuilderI<State>;
    withFact(fact: Fact, ...facts: Fact[]): BuilderI<State>;
    withNonce(): BuilderI<State>;
    claimCapability(capability: Capability): BuilderI<State>;
    claimCapability(capability: Capability, ...capabilities: Capability[]): BuilderI<State>;
    claimCapability(capability: Capability, ...capabilities: Capability[]): BuilderI<State>;
    delegateCapability(requiredCapability: Capability, store: StoreI): State extends CapabilityLookupCapableState ? BuilderI<State> : never;
    delegateCapability(requiredCapability: Capability, proof: DelegationChain, semantics: DelegationSemantics): State extends CapabilityLookupCapableState ? BuilderI<State> : never;
    delegateCapability(requiredCapability: Capability, storeOrProof: StoreI | DelegationChain, semantics?: DelegationSemantics): BuilderI<State>;
    buildPayload(): State extends BuildableState ? UcanPayload : never;
    buildPayload(): UcanPayload;
    build(): Promise<State extends BuildableState ? Ucan : never>;
    build(): Promise<Ucan>;
}
export declare function isKeypair(obj: unknown): obj is Keypair;
export declare function isUcanHeader(obj: unknown): obj is UcanHeader;
export declare function isUcanPayload(obj: unknown): obj is UcanPayload;
