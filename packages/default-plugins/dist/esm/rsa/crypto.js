var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { webcrypto } from "one-webcrypto";
import * as uint8arrays from "uint8arrays";
import { RSA_DID_PREFIX, RSA_DID_PREFIX_OLD } from "../prefixes.js";
import { didFromKeyBytes, keyBytesFromDid } from "../util.js";
export const RSA_ALG = "RSASSA-PKCS1-v1_5";
export const DEFAULT_KEY_SIZE = 2048;
export const DEFAULT_HASH_ALG = "SHA-256";
export const SALT_LEGNTH = 128;
export const generateKeypair = (size = DEFAULT_KEY_SIZE) => __awaiter(void 0, void 0, void 0, function* () {
    return yield webcrypto.subtle.generateKey({
        name: RSA_ALG,
        modulusLength: size,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: DEFAULT_HASH_ALG }
    }, false, ["sign", "verify"]);
});
export const exportKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const buf = yield webcrypto.subtle.exportKey("spki", key);
    return new Uint8Array(buf);
});
export const importKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield webcrypto.subtle.importKey("spki", key, { name: RSA_ALG, hash: { name: DEFAULT_HASH_ALG } }, true, ["verify"]);
});
export const sign = (msg, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    const buf = yield webcrypto.subtle.sign({ name: RSA_ALG, saltLength: SALT_LEGNTH }, privateKey, msg);
    return new Uint8Array(buf);
});
export const verify = (pubKey, msg, sig) => __awaiter(void 0, void 0, void 0, function* () {
    return yield webcrypto.subtle.verify({ name: RSA_ALG, saltLength: SALT_LEGNTH }, yield importKey(pubKey), sig, msg);
});
export const didToPublicKey = (did) => {
    // DID RSA keys are ASN.1 DER encoded "RSAPublicKeys" (PKCS #1).
    // But the WebCrypto API mostly works with "SubjectPublicKeyInfo" (SPKI),
    // which wraps RSAPublicKey with some metadata.
    // In an unofficial RSA multiformat we were using, we used SPKI,
    // so we have to be careful not to transform *every* RSA DID to SPKI, but
    // only newer DIDs.
    const keyBytes = keyBytesFromDid(did, RSA_DID_PREFIX);
    return convertRSAPublicKeyToSubjectPublicKeyInfo(keyBytes);
};
export const oldDidToPublicKey = (did) => {
    return keyBytesFromDid(did, RSA_DID_PREFIX_OLD);
};
export const publicKeyToDid = (pubkey) => {
    // See also the comment in rsaDidToPublicKeyBytes
    // In this library, we're assuming a single byte encoding for all types of keys.
    // For RSA that is "SubjectPublicKeyInfo", because that's what the WebCrypto API understands.
    // But DIDs assume that all public keys are encoded as "RSAPublicKey".
    const convertedBytes = convertSubjectPublicKeyInfoToRSAPublicKey(pubkey);
    return didFromKeyBytes(convertedBytes, RSA_DID_PREFIX);
};
export const publicKeyToOldDid = (pubkey) => {
    return didFromKeyBytes(pubkey, RSA_DID_PREFIX_OLD);
};
/**
 * The ASN.1 DER encoded header that needs to be added to an
 * ASN.1 DER encoded RSAPublicKey to make it a SubjectPublicKeyInfo.
 *
 * This byte sequence is always the same.
 *
 * A human-readable version of this as part of a dumpasn1 dump:
 *
 *     SEQUENCE {
 *       OBJECT IDENTIFIER rsaEncryption (1 2 840 113549 1 1 1)
 *       NULL
 *     }
 *
 * See https://github.com/ucan-wg/ts-ucan/issues/30
 */
const SPKI_PARAMS_ENCODED = new Uint8Array([48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0]);
const ASN_SEQUENCE_TAG = new Uint8Array([0x30]);
const ASN_BITSTRING_TAG = new Uint8Array([0x03]);
export const convertRSAPublicKeyToSubjectPublicKeyInfo = (rsaPublicKey) => {
    // More info on bitstring encoding: https://docs.microsoft.com/en-us/windows/win32/seccertenroll/about-bit-string
    const bitStringEncoded = uint8arrays.concat([
        ASN_BITSTRING_TAG,
        asn1DERLengthEncode(rsaPublicKey.length + 1),
        new Uint8Array([0x00]),
        rsaPublicKey
    ]);
    return uint8arrays.concat([
        ASN_SEQUENCE_TAG,
        asn1DERLengthEncode(SPKI_PARAMS_ENCODED.length + bitStringEncoded.length),
        SPKI_PARAMS_ENCODED,
        bitStringEncoded,
    ]);
};
export const convertSubjectPublicKeyInfoToRSAPublicKey = (subjectPublicKeyInfo) => {
    let position = 0;
    // go into the top-level SEQUENCE
    position = asn1Into(subjectPublicKeyInfo, ASN_SEQUENCE_TAG, position).position;
    // skip the header we expect (SKPI_PARAMS_ENCODED)
    position = asn1Skip(subjectPublicKeyInfo, ASN_SEQUENCE_TAG, position);
    // we expect the bitstring next
    const bitstringParams = asn1Into(subjectPublicKeyInfo, ASN_BITSTRING_TAG, position);
    const bitstring = subjectPublicKeyInfo.subarray(bitstringParams.position, bitstringParams.position + bitstringParams.length);
    const unusedBitPadding = bitstring[0];
    if (unusedBitPadding !== 0) {
        throw new Error(`Can't convert SPKI to PKCS: Expected bitstring length to be multiple of 8, but got ${unusedBitPadding} unused bits in last byte.`);
    }
    return bitstring.slice(1);
};
// ㊙️
// but some exposed for testing :/
export function asn1DERLengthEncode(length) {
    if (length < 0 || !isFinite(length)) {
        throw new TypeError(`Expected non-negative number. Got ${length}`);
    }
    if (length <= 127) {
        return new Uint8Array([length]);
    }
    const octets = [];
    while (length !== 0) {
        octets.push(length & 0xFF);
        length = length >>> 8;
    }
    octets.reverse();
    return new Uint8Array([0x80 | (octets.length & 0xFF), ...octets]);
}
function asn1DERLengthDecodeWithConsumed(bytes) {
    if ((bytes[0] & 0x80) === 0) {
        return { number: bytes[0], consumed: 1 };
    }
    const numberBytes = bytes[0] & 0x7F;
    if (bytes.length < numberBytes + 1) {
        throw new Error(`ASN parsing error: Too few bytes. Expected encoded length's length to be at least ${numberBytes}`);
    }
    let length = 0;
    for (let i = 0; i < numberBytes; i++) {
        length = length << 8;
        length = length | bytes[i + 1];
    }
    return { number: length, consumed: numberBytes + 1 };
}
export function asn1DERLengthDecode(bytes) {
    return asn1DERLengthDecodeWithConsumed(bytes).number;
}
function asn1Skip(input, expectedTag, position) {
    const parsed = asn1Into(input, expectedTag, position);
    return parsed.position + parsed.length;
}
function asn1Into(input, expectedTag, position) {
    // tag
    const lengthPos = position + expectedTag.length;
    const actualTag = input.subarray(position, lengthPos);
    if (!uint8arrays.equals(actualTag, expectedTag)) {
        throw new Error(`ASN parsing error: Expected tag 0x${uint8arrays.toString(expectedTag, "hex")} at position ${position}, but got ${uint8arrays.toString(actualTag, "hex")}.`);
    }
    // length
    const length = asn1DERLengthDecodeWithConsumed(input.subarray(lengthPos /*, we don't know the end */));
    const contentPos = position + 1 + length.consumed;
    // content
    return { position: contentPos, length: length.number };
}
//# sourceMappingURL=crypto.js.map