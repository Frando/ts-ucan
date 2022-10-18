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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asn1DERLengthDecode = exports.asn1DERLengthEncode = exports.convertSubjectPublicKeyInfoToRSAPublicKey = exports.convertRSAPublicKeyToSubjectPublicKeyInfo = exports.publicKeyToOldDid = exports.publicKeyToDid = exports.oldDidToPublicKey = exports.didToPublicKey = exports.verify = exports.sign = exports.importKey = exports.exportKey = exports.generateKeypair = exports.SALT_LEGNTH = exports.DEFAULT_HASH_ALG = exports.DEFAULT_KEY_SIZE = exports.RSA_ALG = void 0;
const one_webcrypto_1 = require("one-webcrypto");
const uint8arrays = __importStar(require("uint8arrays"));
const prefixes_js_1 = require("../prefixes.js");
const util_js_1 = require("../util.js");
exports.RSA_ALG = "RSASSA-PKCS1-v1_5";
exports.DEFAULT_KEY_SIZE = 2048;
exports.DEFAULT_HASH_ALG = "SHA-256";
exports.SALT_LEGNTH = 128;
const generateKeypair = (size = exports.DEFAULT_KEY_SIZE) => __awaiter(void 0, void 0, void 0, function* () {
    return yield one_webcrypto_1.webcrypto.subtle.generateKey({
        name: exports.RSA_ALG,
        modulusLength: size,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: exports.DEFAULT_HASH_ALG }
    }, false, ["sign", "verify"]);
});
exports.generateKeypair = generateKeypair;
const exportKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const buf = yield one_webcrypto_1.webcrypto.subtle.exportKey("spki", key);
    return new Uint8Array(buf);
});
exports.exportKey = exportKey;
const importKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield one_webcrypto_1.webcrypto.subtle.importKey("spki", key, { name: exports.RSA_ALG, hash: { name: exports.DEFAULT_HASH_ALG } }, true, ["verify"]);
});
exports.importKey = importKey;
const sign = (msg, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    const buf = yield one_webcrypto_1.webcrypto.subtle.sign({ name: exports.RSA_ALG, saltLength: exports.SALT_LEGNTH }, privateKey, msg);
    return new Uint8Array(buf);
});
exports.sign = sign;
const verify = (pubKey, msg, sig) => __awaiter(void 0, void 0, void 0, function* () {
    return yield one_webcrypto_1.webcrypto.subtle.verify({ name: exports.RSA_ALG, saltLength: exports.SALT_LEGNTH }, yield (0, exports.importKey)(pubKey), sig, msg);
});
exports.verify = verify;
const didToPublicKey = (did) => {
    // DID RSA keys are ASN.1 DER encoded "RSAPublicKeys" (PKCS #1).
    // But the WebCrypto API mostly works with "SubjectPublicKeyInfo" (SPKI),
    // which wraps RSAPublicKey with some metadata.
    // In an unofficial RSA multiformat we were using, we used SPKI,
    // so we have to be careful not to transform *every* RSA DID to SPKI, but
    // only newer DIDs.
    const keyBytes = (0, util_js_1.keyBytesFromDid)(did, prefixes_js_1.RSA_DID_PREFIX);
    return (0, exports.convertRSAPublicKeyToSubjectPublicKeyInfo)(keyBytes);
};
exports.didToPublicKey = didToPublicKey;
const oldDidToPublicKey = (did) => {
    return (0, util_js_1.keyBytesFromDid)(did, prefixes_js_1.RSA_DID_PREFIX_OLD);
};
exports.oldDidToPublicKey = oldDidToPublicKey;
const publicKeyToDid = (pubkey) => {
    // See also the comment in rsaDidToPublicKeyBytes
    // In this library, we're assuming a single byte encoding for all types of keys.
    // For RSA that is "SubjectPublicKeyInfo", because that's what the WebCrypto API understands.
    // But DIDs assume that all public keys are encoded as "RSAPublicKey".
    const convertedBytes = (0, exports.convertSubjectPublicKeyInfoToRSAPublicKey)(pubkey);
    return (0, util_js_1.didFromKeyBytes)(convertedBytes, prefixes_js_1.RSA_DID_PREFIX);
};
exports.publicKeyToDid = publicKeyToDid;
const publicKeyToOldDid = (pubkey) => {
    return (0, util_js_1.didFromKeyBytes)(pubkey, prefixes_js_1.RSA_DID_PREFIX_OLD);
};
exports.publicKeyToOldDid = publicKeyToOldDid;
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
const convertRSAPublicKeyToSubjectPublicKeyInfo = (rsaPublicKey) => {
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
exports.convertRSAPublicKeyToSubjectPublicKeyInfo = convertRSAPublicKeyToSubjectPublicKeyInfo;
const convertSubjectPublicKeyInfoToRSAPublicKey = (subjectPublicKeyInfo) => {
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
exports.convertSubjectPublicKeyInfoToRSAPublicKey = convertSubjectPublicKeyInfoToRSAPublicKey;
// ㊙️
// but some exposed for testing :/
function asn1DERLengthEncode(length) {
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
exports.asn1DERLengthEncode = asn1DERLengthEncode;
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
function asn1DERLengthDecode(bytes) {
    return asn1DERLengthDecodeWithConsumed(bytes).number;
}
exports.asn1DERLengthDecode = asn1DERLengthDecode;
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