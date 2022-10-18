var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bigInt from "big-integer";
import * as uint8arrays from "uint8arrays";
import { webcrypto } from "one-webcrypto";
import { didFromKeyBytes, keyBytesFromDid } from "../util.js";
import { P256_DID_PREFIX } from "../prefixes.js";
export const ALG = "ECDSA";
export const DEFAULT_CURVE = "P-256";
export const DEFAULT_HASH_ALG = "SHA-256";
export const generateKeypair = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield webcrypto.subtle.generateKey({
        name: ALG,
        namedCurve: DEFAULT_CURVE,
    }, false, ["sign", "verify"]);
});
export const importKeypairJwk = (privKeyJwk, exportable = false) => __awaiter(void 0, void 0, void 0, function* () {
    const privateKey = yield webcrypto.subtle.importKey("jwk", privKeyJwk, {
        name: ALG,
        namedCurve: DEFAULT_CURVE,
    }, exportable, ["sign"]);
    const { kty, crv, x, y } = privKeyJwk;
    const pubKeyJwk = { kty, crv, x, y };
    const publicKey = yield webcrypto.subtle.importKey("jwk", pubKeyJwk, {
        name: ALG,
        namedCurve: DEFAULT_CURVE,
    }, true, ["verify"]);
    return { privateKey, publicKey };
});
export const exportKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const buf = yield webcrypto.subtle.exportKey("raw", key);
    return new Uint8Array(buf);
});
export const importKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield webcrypto.subtle.importKey("raw", key, { name: ALG, namedCurve: DEFAULT_CURVE }, true, ["verify"]);
});
export const sign = (msg, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    const buf = yield webcrypto.subtle.sign({ name: ALG, hash: { name: DEFAULT_HASH_ALG } }, privateKey, msg);
    return new Uint8Array(buf);
});
export const verify = (pubKey, msg, sig) => __awaiter(void 0, void 0, void 0, function* () {
    return yield webcrypto.subtle.verify({ name: ALG, hash: { name: DEFAULT_HASH_ALG } }, yield importKey(pubKey), sig, msg);
});
export const didToPublicKey = (did) => {
    // The multiformats space (used by did:key) specifies that NIST P-256
    // keys should be encoded as the 33-byte compressed public key,
    // instead of the 65-byte raw public key
    const keyBytes = keyBytesFromDid(did, P256_DID_PREFIX);
    return decompressP256Pubkey(keyBytes);
};
export const publicKeyToDid = (publicKey) => {
    const compressed = compressP256Pubkey(publicKey);
    return didFromKeyBytes(compressed, P256_DID_PREFIX);
};
// PUBLIC KEY COMPRESSION
// -------------------------
// Compression & Decompression algos from:
// https://stackoverflow.com/questions/48521840/biginteger-to-a-uint8array-of-bytes
// Public key compression for NIST P-256
export const compressP256Pubkey = (pubkeyBytes) => {
    if (pubkeyBytes.length !== 65) {
        throw new Error("Expected 65 byte pubkey");
    }
    else if (pubkeyBytes[0] !== 0x04) {
        throw new Error("Expected first byte to be 0x04");
    }
    // first byte is a prefix
    const x = pubkeyBytes.slice(1, 33);
    const y = pubkeyBytes.slice(33, 65);
    const out = new Uint8Array(x.length + 1);
    out[0] = 2 + (y[y.length - 1] & 1);
    out.set(x, 1);
    return out;
};
// Public key decompression for NIST P-256
export const decompressP256Pubkey = (compressed) => {
    if (compressed.length !== 33) {
        throw new Error("Expected 33 byte compress pubkey");
    }
    else if (compressed[0] !== 0x02 && compressed[0] !== 0x03) {
        throw new Error("Expected first byte to be 0x02 or 0x03");
    }
    // Consts for P256 curve
    const two = bigInt(2);
    // 115792089210356248762697446949407573530086143415290314195533631308867097853951
    const prime = two
        .pow(256)
        .subtract(two.pow(224))
        .add(two.pow(192))
        .add(two.pow(96))
        .subtract(1);
    const b = bigInt("41058363725152142129326129780047268409114441015993725554835256314039467401291");
    // Pre-computed value, or literal
    const pIdent = prime.add(1).divide(4); // 28948022302589062190674361737351893382521535853822578548883407827216774463488
    // This value must be 2 or 3. 4 indicates an uncompressed key, and anything else is invalid.
    const signY = bigInt(compressed[0] - 2);
    const x = compressed.slice(1);
    const xBig = bigInt(uint8arrays.toString(x, "base10"));
    // y^2 = x^3 - 3x + b
    const maybeY = xBig
        .pow(3)
        .subtract(xBig.multiply(3))
        .add(b)
        .modPow(pIdent, prime);
    let yBig;
    // If the parity matches, we found our root, otherwise it's the other root
    if (maybeY.mod(2).equals(signY)) {
        yBig = maybeY;
    }
    else {
        // y = prime - y
        yBig = prime.subtract(maybeY);
    }
    const y = uint8arrays.fromString(yBig.toString(10), "base10");
    // left-pad for smaller than 32 byte y
    const offset = 32 - y.length;
    const yPadded = new Uint8Array(32);
    yPadded.set(y, offset);
    // concat coords & prepend P-256 prefix
    const publicKey = uint8arrays.concat([[0x04], x, yPadded]);
    return publicKey;
};
//# sourceMappingURL=crypto.js.map