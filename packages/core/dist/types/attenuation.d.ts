import Plugins from "./plugins.js";
import { Capability } from "./capability/index.js";
import { Ucan } from "./types.js";
import { ResourcePointer } from "./capability/resource-pointer.js";
import { Ability } from "./capability/ability.js";
import { Superuser } from "./capability/super-user.js";
/**
 * UCAN capabilities can have arbitrary semantics for delegation.
 * These semantics can be configured via this record of functions.
 *
 * In most cases you may just want to use `equalCanDelegate` as your semantics,
 * but sometimes you want e.g. path behavior for a file-system-like resource:
 * `path:/parent/` should be able to delegate access to `path:/parent/child/`.
 */
export interface DelegationSemantics {
    /**
     * Whether a parent resource can delegate a child resource.
     *
     * An implementation may for example decide to return true for
     * `canDelegateResource(resourcePointer.parse("path:/parent/"), resourcePointer.parse("path:/parent/child/"))`
     */
    canDelegateResource(parentResource: ResourcePointer, childResource: ResourcePointer): boolean;
    /**
     * Whether a parent ability can delegate a child ability.
     *
     * An implementation may for example decide to return true for
     * `canDelegateAbility(ability.parse("crud/UPDATE"), ability.parse("crud/CREATE"))`
     */
    canDelegateAbility(parentAbility: Ability, childAbility: Ability): boolean;
}
/**
 * A delegation chain for a delegated capability or delegated ownership.
 *
 * This type represents a valid path of delegations through a UCAN.
 *
 * It can be cached as a sort of "witness" that a UCAN actually delegates a particular capability.
 *
 * Or it can be scanned to look for UCANs that may have become invalid due to revocation.
 */
export declare type DelegationChain = DelegatedCapability | DelegatedOwnership;
/**
 * A delegation chain that ends with a concrete capability.
 */
export interface DelegatedCapability {
    /**
     * The capability that the end of the chain grants.
     */
    capability: Capability;
    /**
     * The specific UCAN in the chain witnessing the delegated capability.
     */
    ucan: Ucan;
    /**
     * The rest of the delegation chain. This may include entries
     * for `DelegatedOwnership`.
     */
    chainStep?: DelegationChain;
}
/**
 * A delegation chain that ends with delegated ownership.
 *
 * This is ownership over a specific DID at a certain resource and ability scope.
 */
export interface DelegatedOwnership {
    /**
     * The DID that ownership is delegated for.
     */
    ownershipDID: string;
    /**
     * The kinds of capabilites that can be delegated from the ownership.
     */
    scope: OwnershipScope;
    /**
     * The specific UCAN in the chain witnessing the delegated ownership.
     */
    ucan: Ucan;
    /**
     * The rest of the ownership delegation chain.
     */
    chainStep?: DelegatedOwnership;
}
/**
 * This describes the scope of capabilities that are allowed to be delegated
 * from delegated ownership.
 */
export declare type OwnershipScope = Superuser | {
    scheme: string;
    ability: Ability;
};
/**
 * This computes all possible delegations from given UCAN with given
 * capability delegation semantics.
 *
 * For each entry in the attenuations array of the UCAN there will be at least
 * one delegation chain.
 *
 * These delegation chains are computed lazily, so that if parts of the UCAN have
 * been revoked or can't be loaded, this doesn't keep this function from figuring
 * out different ways of delegating a capability from the attenuations.
 * It also makes it possible to return early if a valid delegation chain has been found.
 */
export declare const delegationChains: (plugins: Plugins) => (semantics: DelegationSemantics, ucan: Ucan, isRevoked?: (ucan: Ucan) => Promise<boolean>) => AsyncIterable<DelegationChain | Error>;
/**
 * Figures out the implied root issuer from a delegation chain.
 *
 * For a given delegation chain this will give you the DID of who
 * "started" the chain, so who claims to be the "owner" of said capability.
 */
export declare function rootIssuer(delegationChain: DelegationChain): string;
/**
 * The default delegation semantics.
 * This will just allow equal capabilities to be delegated,
 * except that it also accounts for superuser abilities.
 */
export declare const equalCanDelegate: DelegationSemantics;
export declare function capabilityCanBeDelegated(semantics: DelegationSemantics, capability: Capability, fromDelegationChain: DelegationChain): boolean;
export declare function ownershipCanBeDelegated(semantics: DelegationSemantics, did: string, scope: OwnershipScope, fromDelegationChain: DelegatedOwnership): boolean;
