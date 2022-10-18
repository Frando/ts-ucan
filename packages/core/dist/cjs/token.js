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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTooEarly = exports.isExpired = exports.validateProofs = exports.validate = exports.parse = exports.encodePayload = exports.encodeHeader = exports.encode = exports.signWithKeypair = exports.sign = exports.buildPayload = exports.build = void 0;
const uint8arrays = __importStar(require("uint8arrays")); // @IMPORT
const semver = __importStar(require("./semver.js"));
const capability = __importStar(require("./capability/index.js"));
const util = __importStar(require("./util.js"));
const index_js_1 = require("./capability/index.js");
const compatibility_js_1 = require("./compatibility.js");
// CONSTANTS
const TYPE = "JWT";
const VERSION = { major: 0, minor: 8, patch: 1 };
// COMPOSING
/**
 * Create a UCAN, User Controlled Authorization Networks, JWT.
 *
 * ### Header
 *
 * `alg`, Algorithm, the type of signature.
 * `typ`, Type, the type of this data structure, JWT.
 * `ucv`, UCAN version.
 *
 * ### Payload
 *
 * `att`, Attenuation, a list of resources and capabilities that the ucan grants.
 * `aud`, Audience, the ID of who it's intended for.
 * `exp`, Expiry, unix timestamp of when the jwt is no longer valid.
 * `fct`, Facts, an array of extra facts or information to attach to the jwt.
 * `iss`, Issuer, the ID of who sent this.
 * `nbf`, Not Before, unix timestamp of when the jwt becomes valid.
 * `nnc`, Nonce, a randomly generated string, used to ensure the uniqueness of the jwt.
 * `prf`, Proofs, nested tokens with equal or greater privileges.
 *
 */
const build = (plugins) => (params) => {
    const keypair = params.issuer;
    const payload = buildPayload(Object.assign(Object.assign({}, params), { issuer: keypair.did() }));
    return (0, exports.signWithKeypair)(plugins)(payload, keypair);
};
exports.build = build;
/**
 * Construct the payload for a UCAN.
 */
function buildPayload(params) {
    const { issuer, audience, capabilities = [], lifetimeInSeconds = 30, expiration, notBefore, facts, proofs = [], addNonce = false } = params;
    // Validate
    if (!issuer.startsWith("did:"))
        throw new Error("The issuer must be a DID");
    if (!audience.startsWith("did:"))
        throw new Error("The audience must be a DID");
    // Timestamps
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const exp = expiration || (currentTimeInSeconds + lifetimeInSeconds);
    // 📦
    return {
        aud: audience,
        att: capabilities,
        exp,
        fct: facts,
        iss: issuer,
        nbf: notBefore,
        nnc: addNonce ? util.generateNonce() : undefined,
        prf: proofs,
    };
}
exports.buildPayload = buildPayload;
/**
 * Encloses a UCAN payload as to form a finalised UCAN.
 */
const sign = (plugins) => (payload, jwtAlg, signFn) => __awaiter(void 0, void 0, void 0, function* () {
    const header = {
        alg: jwtAlg,
        typ: TYPE,
        ucv: VERSION,
    };
    // Issuer key type must match UCAN algorithm
    if (!plugins.verifyIssuerAlg(payload.iss, jwtAlg)) {
        throw new Error("The issuer's key type must match the given key type.");
    }
    // Encode parts
    const encodedHeader = encodeHeader(header);
    const encodedPayload = encodePayload(payload);
    // Sign
    const signedData = `${encodedHeader}.${encodedPayload}`;
    const toSign = uint8arrays.fromString(signedData, "utf8");
    const sig = yield signFn(toSign);
    // 📦
    // we freeze the object to make it more unlikely
    // for signedData & header/payload to get out of sync
    return Object.freeze({
        header,
        payload,
        signedData,
        signature: uint8arrays.toString(sig, "base64url")
    });
});
exports.sign = sign;
/**
 * `sign` with a `Keypair`.
 */
const signWithKeypair = (plugins) => (payload, keypair) => {
    return (0, exports.sign)(plugins)(payload, keypair.jwtAlg, data => keypair.sign(data));
};
exports.signWithKeypair = signWithKeypair;
// ENCODING
/**
 * Encode a UCAN.
 *
 * @param ucan The UCAN to encode
 */
function encode(ucan) {
    return `${ucan.signedData}.${ucan.signature}`;
}
exports.encode = encode;
/**
 * Encode the header of a UCAN.
 *
 * @param header The UcanHeader to encode
 * @returns The header of a UCAN encoded as url-safe base64 JSON
 */
function encodeHeader(header) {
    const headerFormatted = Object.assign(Object.assign({}, header), { ucv: semver.format(header.ucv) });
    return uint8arrays.toString(uint8arrays.fromString(JSON.stringify(headerFormatted), "utf8"), "base64url");
}
exports.encodeHeader = encodeHeader;
/**
 * Encode the payload of a UCAN.
 *
 * NOTE: This will encode capabilities as well, so that it matches the UCAN spec.
 *       In other words, `{ with: { scheme, hierPart }, can: { namespace, segments } }`
 *       becomes `{ with: "${scheme}:${hierPart}", can: "${namespace}/${segment}" }`
 *
 * @param payload The UcanPayload to encode
 */
function encodePayload(payload) {
    const payloadWithEncodedCaps = Object.assign(Object.assign({}, payload), { att: payload.att.map(capability.encode) });
    return uint8arrays.toString(uint8arrays.fromString(JSON.stringify(payloadWithEncodedCaps), "utf8"), "base64url");
}
exports.encodePayload = encodePayload;
/**
 * Parse an encoded UCAN.
 *
 * @param encodedUcan The encoded UCAN.
 */
function parse(encodedUcan) {
    const [encodedHeader, encodedPayload, signature] = encodedUcan.split(".");
    if (encodedHeader == null || encodedPayload == null || signature == null) {
        throw new Error(`Can't parse UCAN: ${encodedUcan}: Expected JWT format: 3 dot-separated base64url-encoded values.`);
    }
    // Header
    let headerJson;
    let headerObject;
    try {
        headerJson = uint8arrays.toString(uint8arrays.fromString(encodedHeader, "base64url"), "utf8");
    }
    catch (_a) {
        throw new Error(`Can't parse UCAN header: ${encodedHeader}: Can't parse as base64url.`);
    }
    try {
        headerObject = JSON.parse(headerJson);
    }
    catch (_b) {
        throw new Error(`Can't parse UCAN header: ${encodedHeader}: Can't parse encoded JSON inside.`);
    }
    // Payload
    let payloadJson;
    let payloadObject;
    try {
        payloadJson = uint8arrays.toString(uint8arrays.fromString(encodedPayload, "base64url"), "utf8");
    }
    catch (_c) {
        throw new Error(`Can't parse UCAN payload: ${encodedPayload}: Can't parse as base64url.`);
    }
    try {
        payloadObject = JSON.parse(payloadJson);
    }
    catch (_d) {
        throw new Error(`Can't parse UCAN payload: ${encodedPayload}: Can't parse encoded JSON inside.`);
    }
    // Compatibility layer
    const { header, payload } = (0, compatibility_js_1.handleCompatibility)(headerObject, payloadObject);
    // Ensure proper types/structure
    const parsedAttenuations = payload.att.reduce((acc, cap) => {
        return (0, index_js_1.isEncodedCapability)(cap)
            ? [...acc, capability.parse(cap)]
            : (0, index_js_1.isCapability)(cap) ? [...acc, cap] : acc;
    }, []);
    // Fin
    return {
        header: header,
        payload: Object.assign(Object.assign({}, payload), { att: parsedAttenuations })
    };
}
exports.parse = parse;
/**
 * Parse & Validate **one layer** of a UCAN.
 * This doesn't validate attenutations and doesn't validate the whole UCAN chain.
 *
 * By default, this will check the signature and time bounds.
 *
 * @param encodedUcan the JWT-encoded UCAN to validate
 * @param options an optional parameter to configure turning off some validation options
 * @returns the parsed & validated UCAN (one layer)
 * @throws Error if the UCAN is invalid
 */
const validate = (plugins) => (encodedUcan, opts) => __awaiter(void 0, void 0, void 0, function* () {
    const { checkIssuer = true, checkSignature = true, checkIsExpired = true, checkIsTooEarly = true } = opts !== null && opts !== void 0 ? opts : {};
    const { header, payload } = parse(encodedUcan);
    const [encodedHeader, encodedPayload, signature] = encodedUcan.split(".");
    if (checkIssuer) {
        const validIssuer = plugins.verifyIssuerAlg(payload.iss, header.alg);
        if (!validIssuer) {
            throw new Error(`Invalid UCAN: ${encodedUcan}: Issuer key type does not match UCAN's \`alg\` property.`);
        }
    }
    if (checkSignature) {
        const sigBytes = uint8arrays.fromString(signature, "base64url");
        const data = uint8arrays.fromString(`${encodedHeader}.${encodedPayload}`, "utf8");
        const validSig = yield plugins.verifySignature(payload.iss, data, sigBytes);
        if (!validSig) {
            throw new Error(`Invalid UCAN: ${encodedUcan}: Signature invalid.`);
        }
    }
    const signedData = `${encodedHeader}.${encodedPayload}`;
    const ucan = { header, payload, signedData, signature };
    if (checkIsExpired && isExpired(ucan)) {
        throw new Error(`Invalid UCAN: ${encodedUcan}: Expired.`);
    }
    if (checkIsTooEarly && (0, exports.isTooEarly)(ucan)) {
        throw new Error(`Invalid UCAN: ${encodedUcan}: Not active yet (too early).`);
    }
    return ucan;
});
exports.validate = validate;
/**
 * Iterates over all proofs and parses & validates them at the same time.
 *
 * If there's an audience/issuer mismatch, the iterated item will contain an `Error`.
 * Otherwise the iterated out will contain a `Ucan`.
 *
 * @param ucan a parsed UCAN
 * @param options optional ValidateOptions to use for validating each proof
 * @return an async iterator of the given ucan's proofs parsed & validated, or an `Error`
 *         for each proof that couldn't be validated or parsed.
 */
const validateProofs = (plugins) => function (ucan, opts) {
    return __asyncGenerator(this, arguments, function* () {
        const { checkAddressing = true, checkTimeBoundsSubset = true, checkVersionMonotonic = true } = opts || {};
        for (const prf of ucan.payload.prf) {
            try {
                const proof = yield __await((0, exports.validate)(plugins)(prf, opts));
                if (checkAddressing && ucan.payload.iss !== proof.payload.aud) {
                    throw new Error(`Invalid Proof: Issuer ${ucan.payload.iss} doesn't match parent's audience ${proof.payload.aud}`);
                }
                if (checkTimeBoundsSubset && proof.payload.nbf != null && ucan.payload.exp > proof.payload.nbf) {
                    throw new Error(`Invalid Proof: 'Not before' (${proof.payload.nbf}) is after parent's expiration (${ucan.payload.exp})`);
                }
                if (checkTimeBoundsSubset && ucan.payload.nbf != null && ucan.payload.nbf > proof.payload.exp) {
                    throw new Error(`Invalid Proof: Expiration (${proof.payload.exp}) is before parent's 'not before' (${ucan.payload.nbf})`);
                }
                if (checkVersionMonotonic && semver.lt(ucan.header.ucv, proof.header.ucv)) {
                    throw new Error(`Invalid Proof: Version (${proof.header.ucv}) is higher than parent's version (${ucan.header.ucv})`);
                }
                yield yield __await(proof);
            }
            catch (e) {
                if (e instanceof Error) {
                    yield yield __await(e);
                }
                else {
                    yield yield __await(new Error(`Error when trying to parse UCAN proof: ${e}`));
                }
            }
        }
    });
};
exports.validateProofs = validateProofs;
/**
 * Check if a UCAN is expired.
 *
 * @param ucan The UCAN to validate
 */
function isExpired(ucan) {
    return ucan.payload.exp <= Math.floor(Date.now() / 1000);
}
exports.isExpired = isExpired;
/**
 * Check if a UCAN is not active yet.
 *
 * @param ucan The UCAN to validate
 */
const isTooEarly = (ucan) => {
    if (ucan.payload.nbf == null)
        return false;
    return ucan.payload.nbf > Math.floor(Date.now() / 1000);
};
exports.isTooEarly = isTooEarly;
//# sourceMappingURL=token.js.map