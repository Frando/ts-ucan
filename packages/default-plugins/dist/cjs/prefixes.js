"use strict";
// Each prefix is varint-encoded. So e.g. 0x1205 gets varint-encoded to 0x8524
// The varint encoding is described here: https://github.com/multiformats/unsigned-varint
// These varints are encoded big-endian in 7-bit pieces.
// So 0x1205 is split up into 0x12 and 0x05
// Because there's another byte to be read, the MSB of 0x05 is set: 0x85
// The next 7 bits encode as 0x24 (instead of 0x12) => 0x8524
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE58_DID_PREFIX = exports.RSA_DID_PREFIX_OLD = exports.RSA_DID_PREFIX = exports.P521_DID_PREFIX = exports.P384_DID_PREFIX = exports.P256_DID_PREFIX = exports.BLS_DID_PREFIX = exports.EDWARDS_DID_PREFIX = void 0;
/** https://github.com/multiformats/multicodec/blob/e9ecf587558964715054a0afcc01f7ace220952c/table.csv#L94 */
exports.EDWARDS_DID_PREFIX = new Uint8Array([0xed, 0x01]);
/** https://github.com/multiformats/multicodec/blob/e9ecf587558964715054a0afcc01f7ace220952c/table.csv#L91 */
exports.BLS_DID_PREFIX = new Uint8Array([0xea, 0x01]);
/** https://github.com/multiformats/multicodec/blob/e9ecf587558964715054a0afcc01f7ace220952c/table.csv#L141 */
exports.P256_DID_PREFIX = new Uint8Array([0x80, 0x24]);
/** https://github.com/multiformats/multicodec/blob/e9ecf587558964715054a0afcc01f7ace220952c/table.csv#L142 */
exports.P384_DID_PREFIX = new Uint8Array([0x81, 0x24]);
/** https://github.com/multiformats/multicodec/blob/e9ecf587558964715054a0afcc01f7ace220952c/table.csv#L143 */
exports.P521_DID_PREFIX = new Uint8Array([0x82, 0x24]);
/** https://github.com/multiformats/multicodec/blob/e9ecf587558964715054a0afcc01f7ace220952c/table.csv#L146 */
exports.RSA_DID_PREFIX = new Uint8Array([0x85, 0x24]);
/** Old RSA DID prefix, used pre-standardisation */
exports.RSA_DID_PREFIX_OLD = new Uint8Array([0x00, 0xf5, 0x02]);
exports.BASE58_DID_PREFIX = "did:key:z"; // z is the multibase prefix for base58btc byte encoding
//# sourceMappingURL=prefixes.js.map