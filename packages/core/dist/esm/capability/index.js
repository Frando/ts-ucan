import * as ability from "./ability.js";
import * as resourcePointer from "./resource-pointer.js";
import * as util from "../util.js";
import { isAbility } from "./ability.js";
import { isResourcePointer } from "./resource-pointer.js";
// RE-EXPORTS
export { ability, resourcePointer, isAbility };
// TYPE CHECKS
export function isCapability(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "with") && isResourcePointer(obj.with)
        && util.hasProp(obj, "can") && isAbility(obj.can);
}
export function isEncodedCapability(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "with") && typeof obj.with === "string"
        && util.hasProp(obj, "can") && typeof obj.can === "string";
}
// 🌸
export function as(did, resource) {
    return {
        with: resourcePointer.as(did, resource),
        can: ability.SUPERUSER
    };
}
export function my(resource) {
    return {
        with: resourcePointer.my(resource),
        can: ability.SUPERUSER
    };
}
export function prf(selector, ability) {
    return {
        with: resourcePointer.prf(selector),
        can: ability
    };
}
// 🛠
/**
 * Check if two capabilities are equal.
 *
 * This is not the same as `JSON.stringify(capA) === JSON.stringify(capB)`.
 * Specifically:
 *   - For resource pointers, it does case-insensitive matching of the `scheme`.
 *   - For abilities, it does case-insensitive matching of the namespace and segments.
 */
export function isEqual(a, b) {
    return resourcePointer.isEqual(a.with, b.with) && ability.isEqual(a.can, b.can);
}
// ENCODING
/**
 * Encode the individual parts of a capability.
 *
 * @param cap The capability to encode
 */
export function encode(cap) {
    return {
        with: resourcePointer.encode(cap.with),
        can: ability.encode(cap.can)
    };
}
/**
 * Parse an encoded capability.
 *
 * @param cap The encoded capability
 */
export function parse(cap) {
    return {
        with: resourcePointer.parse(cap.with),
        can: ability.parse(cap.can)
    };
}
//# sourceMappingURL=index.js.map