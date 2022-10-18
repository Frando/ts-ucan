import { SUPERUSER } from "./super-user.js";
import * as util from "../util.js";
/**
 * Separator for pieces of a URI.
 */
export const SEPARATOR = ":";
// TYPE CHECKS
export function isResourcePointer(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "scheme") && typeof obj.scheme === "string"
        && util.hasProp(obj, "hierPart") && (obj.hierPart === SUPERUSER || typeof obj.hierPart === "string");
}
// 🌸
export function as(did, resource) {
    return {
        scheme: "as",
        hierPart: `${did}:${resource}`
    };
}
export function my(resource) {
    return {
        scheme: "my",
        hierPart: resource
    };
}
export function prf(selector) {
    return {
        scheme: "prf",
        hierPart: selector.toString()
    };
}
// 🛠
export function isEqual(a, b) {
    return a.scheme.toLowerCase() === a.scheme.toLowerCase() && a.hierPart === b.hierPart;
}
// ENCODING
/**
 * Encode a resource pointer.
 *
 * @param pointer The resource pointer to encode
 */
export function encode(pointer) {
    return `${pointer.scheme}${SEPARATOR}${pointer.hierPart}`;
}
/**
 * Parse an encoded resource pointer.
 *
 * @param pointer The encoded resource pointer
 */
export function parse(pointer) {
    const [scheme, ...hierPart] = pointer.split(SEPARATOR);
    return { scheme, hierPart: hierPart.join(SEPARATOR) };
}
//# sourceMappingURL=resource-pointer.js.map