import Plugins from "./plugins.js";
import { Capability } from "./capability/index.js";
import { Fact, Keypair, DidableKey } from "./types.js";
import { Ucan, UcanHeader, UcanParts, UcanPayload } from "./types.js";
/**
 * Create a UCAN, User Controlled Authorization Networks, JWT.
 *
 * ### Header
 *
 * `alg`, Algorithm, the type of signature.
 * `typ`, Type, the type of this data structure, JWT.
 * `ucv`, UCAN version.
 *
 * ### Payload
 *
 * `att`, Attenuation, a list of resources and capabilities that the ucan grants.
 * `aud`, Audience, the ID of who it's intended for.
 * `exp`, Expiry, unix timestamp of when the jwt is no longer valid.
 * `fct`, Facts, an array of extra facts or information to attach to the jwt.
 * `iss`, Issuer, the ID of who sent this.
 * `nbf`, Not Before, unix timestamp of when the jwt becomes valid.
 * `nnc`, Nonce, a randomly generated string, used to ensure the uniqueness of the jwt.
 * `prf`, Proofs, nested tokens with equal or greater privileges.
 *
 */
export declare const build: (plugins: Plugins) => (params: {
    issuer: DidableKey;
    audience: string;
    capabilities?: Array<Capability>;
    lifetimeInSeconds?: number;
    expiration?: number;
    notBefore?: number;
    facts?: Array<Fact>;
    proofs?: Array<string>;
    addNonce?: boolean;
}) => Promise<Ucan>;
/**
 * Construct the payload for a UCAN.
 */
export declare function buildPayload(params: {
    issuer: string;
    audience: string;
    capabilities?: Array<Capability>;
    lifetimeInSeconds?: number;
    expiration?: number;
    notBefore?: number;
    facts?: Array<Fact>;
    proofs?: Array<string>;
    addNonce?: boolean;
}): UcanPayload;
/**
 * Encloses a UCAN payload as to form a finalised UCAN.
 */
export declare const sign: (plugins: Plugins) => (payload: UcanPayload, jwtAlg: string, signFn: (data: Uint8Array) => Promise<Uint8Array>) => Promise<Ucan>;
/**
 * `sign` with a `Keypair`.
 */
export declare const signWithKeypair: (plugins: Plugins) => (payload: UcanPayload, keypair: Keypair) => Promise<Ucan>;
/**
 * Encode a UCAN.
 *
 * @param ucan The UCAN to encode
 */
export declare function encode(ucan: Ucan<unknown>): string;
/**
 * Encode the header of a UCAN.
 *
 * @param header The UcanHeader to encode
 * @returns The header of a UCAN encoded as url-safe base64 JSON
 */
export declare function encodeHeader(header: UcanHeader): string;
/**
 * Encode the payload of a UCAN.
 *
 * NOTE: This will encode capabilities as well, so that it matches the UCAN spec.
 *       In other words, `{ with: { scheme, hierPart }, can: { namespace, segments } }`
 *       becomes `{ with: "${scheme}:${hierPart}", can: "${namespace}/${segment}" }`
 *
 * @param payload The UcanPayload to encode
 */
export declare function encodePayload(payload: UcanPayload): string;
/**
 * Parse an encoded UCAN.
 *
 * @param encodedUcan The encoded UCAN.
 */
export declare function parse(encodedUcan: string): UcanParts;
/**
 * Validation options
 */
export interface ValidateOptions {
    checkIssuer?: boolean;
    checkSignature?: boolean;
    checkIsExpired?: boolean;
    checkIsTooEarly?: boolean;
}
/**
 * Parse & Validate **one layer** of a UCAN.
 * This doesn't validate attenutations and doesn't validate the whole UCAN chain.
 *
 * By default, this will check the signature and time bounds.
 *
 * @param encodedUcan the JWT-encoded UCAN to validate
 * @param options an optional parameter to configure turning off some validation options
 * @returns the parsed & validated UCAN (one layer)
 * @throws Error if the UCAN is invalid
 */
export declare const validate: (plugins: Plugins) => (encodedUcan: string, opts?: Partial<ValidateOptions>) => Promise<Ucan>;
/**
 * Proof validation options.
 */
export interface ValidateProofsOptions extends ValidateOptions {
    /**
     * Whether to check if the ucan's issuer matches its proofs audiences.
     */
    checkAddressing?: boolean;
    /**
     * Whether to check if a ucan's time bounds are a subset of its proofs time bounds.
     */
    checkTimeBoundsSubset?: boolean;
    /**
     * Whether to check if a ucan's version is bigger or equal to its proofs version.
     */
    checkVersionMonotonic?: boolean;
}
/**
 * Iterates over all proofs and parses & validates them at the same time.
 *
 * If there's an audience/issuer mismatch, the iterated item will contain an `Error`.
 * Otherwise the iterated out will contain a `Ucan`.
 *
 * @param ucan a parsed UCAN
 * @param options optional ValidateOptions to use for validating each proof
 * @return an async iterator of the given ucan's proofs parsed & validated, or an `Error`
 *         for each proof that couldn't be validated or parsed.
 */
export declare const validateProofs: (plugins: Plugins) => (ucan: Ucan, opts?: Partial<ValidateProofsOptions>) => AsyncIterable<Ucan | Error>;
/**
 * Check if a UCAN is expired.
 *
 * @param ucan The UCAN to validate
 */
export declare function isExpired(ucan: Ucan): boolean;
/**
 * Check if a UCAN is not active yet.
 *
 * @param ucan The UCAN to validate
 */
export declare const isTooEarly: (ucan: Ucan) => boolean;
