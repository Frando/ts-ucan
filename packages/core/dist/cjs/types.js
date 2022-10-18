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
exports.isUcanPayload = exports.isUcanHeader = exports.isKeypair = void 0;
const semver = __importStar(require("./semver.js"));
const index_js_1 = require("./capability/index.js");
const util = __importStar(require("./util.js"));
// TYPE CHECKS
function isKeypair(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "jwtAlg") && typeof obj.jwtAlg === "string"
        && util.hasProp(obj, "sign") && typeof obj.sign === "function";
}
exports.isKeypair = isKeypair;
function isUcanHeader(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "alg") && typeof obj.alg === "string"
        && util.hasProp(obj, "typ") && typeof obj.typ === "string"
        && util.hasProp(obj, "ucv") && semver.isSemVer(obj.ucv);
}
exports.isUcanHeader = isUcanHeader;
function isUcanPayload(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "iss") && typeof obj.iss === "string"
        && util.hasProp(obj, "aud") && typeof obj.aud === "string"
        && util.hasProp(obj, "exp") && typeof obj.exp === "number"
        && (!util.hasProp(obj, "nbf") || typeof obj.nbf === "number")
        && (!util.hasProp(obj, "nnc") || typeof obj.nnc === "string")
        && util.hasProp(obj, "att") && Array.isArray(obj.att) && obj.att.every(a => (0, index_js_1.isCapability)(a) || (0, index_js_1.isEncodedCapability)(a))
        && (!util.hasProp(obj, "fct") || Array.isArray(obj.fct) && obj.fct.every(util.isRecord))
        && util.hasProp(obj, "prf") && Array.isArray(obj.prf) && obj.prf.every(str => typeof str === "string");
}
exports.isUcanPayload = isUcanPayload;
//# sourceMappingURL=types.js.map