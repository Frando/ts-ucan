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
exports.parse = exports.encode = exports.isEqual = exports.prf = exports.my = exports.as = exports.isResourcePointer = exports.SEPARATOR = void 0;
const super_user_js_1 = require("./super-user.js");
const util = __importStar(require("../util.js"));
/**
 * Separator for pieces of a URI.
 */
exports.SEPARATOR = ":";
// TYPE CHECKS
function isResourcePointer(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "scheme") && typeof obj.scheme === "string"
        && util.hasProp(obj, "hierPart") && (obj.hierPart === super_user_js_1.SUPERUSER || typeof obj.hierPart === "string");
}
exports.isResourcePointer = isResourcePointer;
// 🌸
function as(did, resource) {
    return {
        scheme: "as",
        hierPart: `${did}:${resource}`
    };
}
exports.as = as;
function my(resource) {
    return {
        scheme: "my",
        hierPart: resource
    };
}
exports.my = my;
function prf(selector) {
    return {
        scheme: "prf",
        hierPart: selector.toString()
    };
}
exports.prf = prf;
// 🛠
function isEqual(a, b) {
    return a.scheme.toLowerCase() === a.scheme.toLowerCase() && a.hierPart === b.hierPart;
}
exports.isEqual = isEqual;
// ENCODING
/**
 * Encode a resource pointer.
 *
 * @param pointer The resource pointer to encode
 */
function encode(pointer) {
    return `${pointer.scheme}${exports.SEPARATOR}${pointer.hierPart}`;
}
exports.encode = encode;
/**
 * Parse an encoded resource pointer.
 *
 * @param pointer The encoded resource pointer
 */
function parse(pointer) {
    const [scheme, ...hierPart] = pointer.split(exports.SEPARATOR);
    return { scheme, hierPart: hierPart.join(exports.SEPARATOR) };
}
exports.parse = parse;
//# sourceMappingURL=resource-pointer.js.map