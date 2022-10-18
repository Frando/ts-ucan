var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as uint8arrays from "uint8arrays";
export class Plugins {
    constructor(keys, methods) {
        this.keys = keys;
        this.methods = methods;
    }
    verifyIssuerAlg(did, jwtAlg) {
        const didMethod = parseDidMethod(did);
        if (didMethod === "key") {
            const bytes = parsePrefixedBytes(did);
            for (const keyPlugin of this.keys) {
                if (hasPrefix(bytes, keyPlugin.prefix)) {
                    return jwtAlg === keyPlugin.jwtAlg;
                }
            }
        }
        else {
            const maybePlugin = this.methods[didMethod];
            if (maybePlugin) {
                return maybePlugin.checkJwtAlg(did, jwtAlg);
            }
        }
        throw new Error(`DID method not supported by plugins: ${did}`);
    }
    verifySignature(did, data, sig) {
        return __awaiter(this, void 0, void 0, function* () {
            const didMethod = parseDidMethod(did);
            if (didMethod === "key") {
                const bytes = parsePrefixedBytes(did);
                for (const keyPlugin of this.keys) {
                    if (hasPrefix(bytes, keyPlugin.prefix)) {
                        return keyPlugin.verifySignature(did, data, sig);
                    }
                }
            }
            else {
                const maybePlugin = this.methods[didMethod];
                if (maybePlugin) {
                    return maybePlugin.verifySignature(did, data, sig);
                }
            }
            throw new Error(`DID method not supported by plugins: ${did}`);
        });
    }
}
export default Plugins;
const hasPrefix = (prefixedKey, prefix) => {
    return uint8arrays.equals(prefix, prefixedKey.subarray(0, prefix.byteLength));
};
const BASE58_DID_PREFIX = "did:key:z";
// @TODO would be better to follow the actual varint spec here (instead of guess & check):
// https://github.com/multiformats/unsigned-varint 
const parsePrefixedBytes = (did) => {
    if (!did.startsWith(BASE58_DID_PREFIX)) {
        throw new Error(`Not a valid base58 formatted did:key: ${did}`);
    }
    return uint8arrays.fromString(did.slice(BASE58_DID_PREFIX.length), "base58btc");
};
const parseDidMethod = (did) => {
    const parts = did.split(":");
    if (parts[0] !== "did") {
        throw new Error(`Not a DID: ${did}`);
    }
    if (parts[1].length < 1) {
        throw new Error(`No DID method included: ${did}`);
    }
    return parts[1];
};
//# sourceMappingURL=plugins.js.map