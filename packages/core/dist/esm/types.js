import * as semver from "./semver.js";
import { isCapability, isEncodedCapability } from "./capability/index.js";
import * as util from "./util.js";
// TYPE CHECKS
export function isKeypair(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "jwtAlg") && typeof obj.jwtAlg === "string"
        && util.hasProp(obj, "sign") && typeof obj.sign === "function";
}
export function isUcanHeader(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "alg") && typeof obj.alg === "string"
        && util.hasProp(obj, "typ") && typeof obj.typ === "string"
        && util.hasProp(obj, "ucv") && semver.isSemVer(obj.ucv);
}
export function isUcanPayload(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "iss") && typeof obj.iss === "string"
        && util.hasProp(obj, "aud") && typeof obj.aud === "string"
        && util.hasProp(obj, "exp") && typeof obj.exp === "number"
        && (!util.hasProp(obj, "nbf") || typeof obj.nbf === "number")
        && (!util.hasProp(obj, "nnc") || typeof obj.nnc === "string")
        && util.hasProp(obj, "att") && Array.isArray(obj.att) && obj.att.every(a => isCapability(a) || isEncodedCapability(a))
        && (!util.hasProp(obj, "fct") || Array.isArray(obj.fct) && obj.fct.every(util.isRecord))
        && util.hasProp(obj, "prf") && Array.isArray(obj.prf) && obj.prf.every(str => typeof str === "string");
}
//# sourceMappingURL=types.js.map