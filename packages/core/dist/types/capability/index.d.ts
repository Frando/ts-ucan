import * as ability from "./ability.js";
import * as resourcePointer from "./resource-pointer.js";
import { Ability, isAbility } from "./ability.js";
import { ResourcePointer } from "./resource-pointer.js";
import { Superuser } from "./super-user.js";
export { ability, resourcePointer, Ability, isAbility };
export declare type Capability = {
    with: ResourcePointer;
    can: Ability;
};
export declare type EncodedCapability = {
    with: string;
    can: string;
};
export declare function isCapability(obj: unknown): obj is Capability;
export declare function isEncodedCapability(obj: unknown): obj is EncodedCapability;
export declare function as(did: string, resource: Superuser | string): Capability;
export declare function my(resource: Superuser | string): Capability;
export declare function prf(selector: Superuser | number, ability: Ability): Capability;
/**
 * Check if two capabilities are equal.
 *
 * This is not the same as `JSON.stringify(capA) === JSON.stringify(capB)`.
 * Specifically:
 *   - For resource pointers, it does case-insensitive matching of the `scheme`.
 *   - For abilities, it does case-insensitive matching of the namespace and segments.
 */
export declare function isEqual(a: Capability, b: Capability): boolean;
/**
 * Encode the individual parts of a capability.
 *
 * @param cap The capability to encode
 */
export declare function encode(cap: Capability): EncodedCapability;
/**
 * Parse an encoded capability.
 *
 * @param cap The encoded capability
 */
export declare function parse(cap: EncodedCapability): Capability;
