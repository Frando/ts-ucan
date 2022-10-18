import { SUPERUSER } from "./super-user.js";
import * as util from "../util.js";
// RE-EXPORTS
export { SUPERUSER };
/**
 * Separator for an ability's segments.
 */
export const SEPARATOR = "/";
/**
 * Ability that can be used with a `prf` resource-pointer.
 * This redelegates all capabilities of the proof(s).
 */
export const REDELEGATE = { namespace: "ucan", segments: ["DELEGATE"] };
// TYPE CHECKS
export function isAbility(obj) {
    return obj === SUPERUSER
        || (util.isRecord(obj)
            && util.hasProp(obj, "namespace") && typeof obj.namespace === "string"
            && util.hasProp(obj, "segments") && Array.isArray(obj.segments) && obj.segments.every(s => typeof s === "string"));
}
// 🛠
export function isEqual(a, b) {
    if (a === SUPERUSER && b === SUPERUSER)
        return true;
    if (a === SUPERUSER || b === SUPERUSER)
        return false;
    return (a.namespace.toLowerCase() ===
        b.namespace.toLowerCase()) &&
        (joinSegments(a.segments).toLowerCase() ===
            joinSegments(b.segments).toLowerCase());
}
export function joinSegments(segments) {
    return segments.join(SEPARATOR);
}
// ENCODING
/**
 * Encode an ability.
 *
 * @param ability The ability to encode
 */
export function encode(ability) {
    switch (ability) {
        case SUPERUSER: return ability;
        default: return joinSegments([ability.namespace, ...ability.segments]);
    }
}
/**
 * Parse an encoded ability.
 *
 * @param ability The encoded ability
 */
export function parse(ability) {
    switch (ability) {
        case SUPERUSER:
            return SUPERUSER;
        default: {
            const [namespace, ...segments] = ability.split(SEPARATOR);
            return { namespace, segments };
        }
    }
}
//# sourceMappingURL=ability.js.map