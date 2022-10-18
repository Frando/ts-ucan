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
exports.parse = exports.encode = exports.isEqual = exports.prf = exports.my = exports.as = exports.isEncodedCapability = exports.isCapability = exports.isAbility = exports.resourcePointer = exports.ability = void 0;
const ability = __importStar(require("./ability.js"));
exports.ability = ability;
const resourcePointer = __importStar(require("./resource-pointer.js"));
exports.resourcePointer = resourcePointer;
const util = __importStar(require("../util.js"));
const ability_js_1 = require("./ability.js");
Object.defineProperty(exports, "isAbility", { enumerable: true, get: function () { return ability_js_1.isAbility; } });
const resource_pointer_js_1 = require("./resource-pointer.js");
// TYPE CHECKS
function isCapability(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "with") && (0, resource_pointer_js_1.isResourcePointer)(obj.with)
        && util.hasProp(obj, "can") && (0, ability_js_1.isAbility)(obj.can);
}
exports.isCapability = isCapability;
function isEncodedCapability(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "with") && typeof obj.with === "string"
        && util.hasProp(obj, "can") && typeof obj.can === "string";
}
exports.isEncodedCapability = isEncodedCapability;
// 🌸
function as(did, resource) {
    return {
        with: resourcePointer.as(did, resource),
        can: ability.SUPERUSER
    };
}
exports.as = as;
function my(resource) {
    return {
        with: resourcePointer.my(resource),
        can: ability.SUPERUSER
    };
}
exports.my = my;
function prf(selector, ability) {
    return {
        with: resourcePointer.prf(selector),
        can: ability
    };
}
exports.prf = prf;
// 🛠
/**
 * Check if two capabilities are equal.
 *
 * This is not the same as `JSON.stringify(capA) === JSON.stringify(capB)`.
 * Specifically:
 *   - For resource pointers, it does case-insensitive matching of the `scheme`.
 *   - For abilities, it does case-insensitive matching of the namespace and segments.
 */
function isEqual(a, b) {
    return resourcePointer.isEqual(a.with, b.with) && ability.isEqual(a.can, b.can);
}
exports.isEqual = isEqual;
// ENCODING
/**
 * Encode the individual parts of a capability.
 *
 * @param cap The capability to encode
 */
function encode(cap) {
    return {
        with: resourcePointer.encode(cap.with),
        can: ability.encode(cap.can)
    };
}
exports.encode = encode;
/**
 * Parse an encoded capability.
 *
 * @param cap The encoded capability
 */
function parse(cap) {
    return {
        with: resourcePointer.parse(cap.with),
        can: ability.parse(cap.can)
    };
}
exports.parse = parse;
//# sourceMappingURL=index.js.map