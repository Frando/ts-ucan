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
exports.hasPrefix = exports.didFromKeyBytes = exports.keyBytesFromDid = void 0;
const uint8arrays = __importStar(require("uint8arrays"));
const prefixes_js_1 = require("./prefixes.js");
function keyBytesFromDid(did, expectedPrefix) {
    if (!did.startsWith(prefixes_js_1.BASE58_DID_PREFIX)) {
        throw new Error("Please use a base58-encoded DID formatted `did:key:z...`");
    }
    const didWithoutPrefix = did.slice(prefixes_js_1.BASE58_DID_PREFIX.length);
    const bytes = uint8arrays.fromString(didWithoutPrefix, "base58btc");
    if (!(0, exports.hasPrefix)(bytes, expectedPrefix)) {
        throw new Error(`Expected prefix: ${expectedPrefix}`);
    }
    return bytes.slice(expectedPrefix.length);
}
exports.keyBytesFromDid = keyBytesFromDid;
function didFromKeyBytes(publicKeyBytes, prefix) {
    const bytes = uint8arrays.concat([prefix, publicKeyBytes]);
    const base58Key = uint8arrays.toString(bytes, "base58btc");
    return prefixes_js_1.BASE58_DID_PREFIX + base58Key;
}
exports.didFromKeyBytes = didFromKeyBytes;
/**
 * Determines if a Uint8Array has a given indeterminate length-prefix.
 */
const hasPrefix = (prefixedKey, prefix) => {
    return uint8arrays.equals(prefix, prefixedKey.subarray(0, prefix.byteLength));
};
exports.hasPrefix = hasPrefix;
//# sourceMappingURL=util.js.map