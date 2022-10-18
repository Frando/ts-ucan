import Plugins from "./plugins.js";
import { DelegationSemantics, DelegationChain } from "./attenuation.js";
import { Capability } from "./capability/index.js";
import { Fact, Ucan } from "./types.js";
export declare type Result<Ok, Err = Error> = {
    ok: true;
    value: Ok;
} | {
    ok: false;
    error: Err;
};
export interface VerifyOptions {
    /**
     * the DID of the callee of this function. The expected audience of the outermost level of the UCAN.
     * NOTE: This DID should not be hardcoded in production calls to this function.
     */
    audience: string;
    /**
     * a non-empty list of capabilities required for this UCAN invocation. The root issuer and capability
     * should be derived from something like your HTTP request parameters. They identify the resource
     * that's access-controlled.
     */
    requiredCapabilities: {
        capability: Capability;
        rootIssuer: string;
    }[];
    /**
    * an optional record of functions that specify what the rules for delegating capabilities are.
    * If not provided, the default semantics will be `equalCanDelegate`.
    */
    semantics?: DelegationSemantics;
    /**
     * an async predicate on UCANs to figure out whether they've been revoked or not.
     * Usually that means checking whether the hash of the UCAN is in a list of revoked UCANs.
     * If not provided, it will assume no UCAN to be revoked.
     */
    isRevoked?: (ucan: Ucan) => Promise<boolean>;
    /**
     * an optional function that's given the list of facts in the root UCAN and returns a boolean indicating
     * whether the facts include everything you expect for the UCAN invocation to check.
     * By default this will ignore all facts in the UCAN and just return true.
     */
    checkFacts?: (facts: Fact[]) => boolean;
}
/**
 * Verify a UCAN for an invocation.
 *
 * @param ucan a UCAN to verify for invocation in JWT format. (starts with 'eyJ...' and has two '.' in it)
 *
 * @param options required and optional verification options see {@link VerifyOptions}
 *
 * @throws TypeError if the passed arguments don't match what is expected
 */
export declare const verify: (plugins: Plugins) => (ucan: string, options: VerifyOptions) => Promise<Result<Verification[], Error[]>>;
export interface Verification {
    capability: Capability;
    rootIssuer: string;
    proof: DelegationChain;
}
