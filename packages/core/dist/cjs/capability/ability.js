"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.encode = exports.joinSegments = exports.isEqual = exports.isAbility = exports.REDELEGATE = exports.SEPARATOR = exports.SUPERUSER = void 0;
const super_user_js_1 = require("./super-user.js");
Object.defineProperty(exports, "SUPERUSER", { enumerable: true, get: function () { return super_user_js_1.SUPERUSER; } });
const util = __importStar(require("../util.js"));
/**
 * Separator for an ability's segments.
 */
exports.SEPARATOR = "/";
/**
 * Ability that can be used with a `prf` resource-pointer.
 * This redelegates all capabilities of the proof(s).
 */
exports.REDELEGATE = { namespace: "ucan", segments: ["DELEGATE"] };
// TYPE CHECKS
function isAbility(obj) {
    return obj === super_user_js_1.SUPERUSER
        || (util.isRecord(obj)
            && util.hasProp(obj, "namespace") && typeof obj.namespace === "string"
            && util.hasProp(obj, "segments") && Array.isArray(obj.segments) && obj.segments.every(s => typeof s === "string"));
}
exports.isAbility = isAbility;
// 🛠
function isEqual(a, b) {
    if (a === super_user_js_1.SUPERUSER && b === super_user_js_1.SUPERUSER)
        return true;
    if (a === super_user_js_1.SUPERUSER || b === super_user_js_1.SUPERUSER)
        return false;
    return (a.namespace.toLowerCase() ===
        b.namespace.toLowerCase()) &&
        (joinSegments(a.segments).toLowerCase() ===
            joinSegments(b.segments).toLowerCase());
}
exports.isEqual = isEqual;
function joinSegments(segments) {
    return segments.join(exports.SEPARATOR);
}
exports.joinSegments = joinSegments;
// ENCODING
/**
 * Encode an ability.
 *
 * @param ability The ability to encode
 */
function encode(ability) {
    switch (ability) {
        case super_user_js_1.SUPERUSER: return ability;
        default: return joinSegments([ability.namespace, ...ability.segments]);
    }
}
exports.encode = encode;
/**
 * Parse an encoded ability.
 *
 * @param ability The encoded ability
 */
function parse(ability) {
    switch (ability) {
        case super_user_js_1.SUPERUSER:
            return super_user_js_1.SUPERUSER;
        default: {
            const [namespace, ...segments] = ability.split(exports.SEPARATOR);
            return { namespace, segments };
        }
    }
}
exports.parse = parse;
//# sourceMappingURL=ability.js.map