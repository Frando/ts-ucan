import * as uint8arrays from "uint8arrays";
import { BASE58_DID_PREFIX } from "./prefixes.js";
export function keyBytesFromDid(did, expectedPrefix) {
    if (!did.startsWith(BASE58_DID_PREFIX)) {
        throw new Error("Please use a base58-encoded DID formatted `did:key:z...`");
    }
    const didWithoutPrefix = did.slice(BASE58_DID_PREFIX.length);
    const bytes = uint8arrays.fromString(didWithoutPrefix, "base58btc");
    if (!hasPrefix(bytes, expectedPrefix)) {
        throw new Error(`Expected prefix: ${expectedPrefix}`);
    }
    return bytes.slice(expectedPrefix.length);
}
export function didFromKeyBytes(publicKeyBytes, prefix) {
    const bytes = uint8arrays.concat([prefix, publicKeyBytes]);
    const base58Key = uint8arrays.toString(bytes, "base58btc");
    return BASE58_DID_PREFIX + base58Key;
}
/**
 * Determines if a Uint8Array has a given indeterminate length-prefix.
 */
export const hasPrefix = (prefixedKey, prefix) => {
    return uint8arrays.equals(prefix, prefixedKey.subarray(0, prefix.byteLength));
};
//# sourceMappingURL=util.js.map