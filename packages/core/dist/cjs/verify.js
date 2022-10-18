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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const token = __importStar(require("./token.js"));
const attenuation_js_1 = require("./attenuation.js");
const index_js_1 = require("./capability/index.js");
const ok = k => ({ ok: true, value: k });
const err = e => ({ ok: false, error: e });
/**
 * Verify a UCAN for an invocation.
 *
 * @param ucan a UCAN to verify for invocation in JWT format. (starts with 'eyJ...' and has two '.' in it)
 *
 * @param options required and optional verification options see {@link VerifyOptions}
 *
 * @throws TypeError if the passed arguments don't match what is expected
 */
const verify = (plugins) => (ucan, options) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    var _b, _c, _d;
    const { audience, requiredCapabilities } = options;
    const semantics = (_b = options.semantics) !== null && _b !== void 0 ? _b : attenuation_js_1.equalCanDelegate;
    const isRevoked = (_c = options.isRevoked) !== null && _c !== void 0 ? _c : (() => __awaiter(void 0, void 0, void 0, function* () { return false; }));
    const checkFacts = (_d = options.checkFacts) !== null && _d !== void 0 ? _d : (() => true);
    // type-check arguments
    if (typeof ucan !== "string") {
        throw new TypeError(`Expected an encoded UCAN string as first argument, but got ${ucan}`);
    }
    if (typeof audience !== "string" || !audience.startsWith("did:")) {
        throw new TypeError(`Expected a DID string as second argument, but got ${audience}`);
    }
    if (typeof isRevoked !== "function") {
        throw new TypeError(`Expected a function returning a promise as third argument, but got ${isRevoked}`);
    }
    if (!Array.isArray(requiredCapabilities)) {
        throw new TypeError(`Expected an array as fourth argument, but got ${requiredCapabilities}`);
    }
    if (requiredCapabilities.length < 1) {
        throw new TypeError(`Expected a non-empty list of required capabilities as 4th argument.`);
    }
    if (requiredCapabilities.some(req => !(0, index_js_1.isCapability)(req.capability) || typeof req.rootIssuer !== "string" || !req.rootIssuer.startsWith("did:"))) {
        throw new TypeError(`Expected an array of records of capabilities and rootIssuers as DID strings as 4th argument, but got ${requiredCapabilities}`);
    }
    if (typeof semantics.canDelegateResource !== "function" || typeof semantics.canDelegateAbility !== "function") {
        throw new TypeError(`Expected a record with two functions 'canDelegateResource' and 'canDelegateAbility' as 5th argument, but got ${semantics}`);
    }
    if (typeof checkFacts !== "function") {
        throw new TypeError(`Expected a function as 6th argument, but got ${checkFacts}`);
    }
    try {
        // Verify the UCAN
        const decoded = yield token.validate(plugins)(ucan);
        // Check that it's addressed to us
        if (decoded.payload.aud !== audience) {
            return err([new Error(`Invalid UCAN: Expected audience to be ${audience}, but it's ${decoded.payload.aud}`)]);
        }
        const errors = [];
        const remaining = new Set(requiredCapabilities);
        const proven = [];
        try {
            // Check that all required capabilities are verified
            loop: for (var _e = __asyncValues((0, attenuation_js_1.delegationChains)(plugins)(semantics, decoded, isRevoked)), _f; _f = yield _e.next(), !_f.done;) {
                const delegationChain = _f.value;
                if (delegationChain instanceof Error) {
                    errors.push(delegationChain);
                    continue;
                }
                // Try to look for capabilities from given delegation chain
                for (const expected of remaining) {
                    if ((0, attenuation_js_1.capabilityCanBeDelegated)(semantics, expected.capability, delegationChain)
                        && (0, attenuation_js_1.rootIssuer)(delegationChain) === expected.rootIssuer) {
                        remaining.delete(expected);
                        proven.push(Object.assign(Object.assign({}, expected), { proof: delegationChain }));
                    }
                }
                // If we've already verified all, we don't need to keep looking
                if (remaining.size === 0) {
                    break loop;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) yield _a.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return remaining.size > 0 ? err(errors) : ok(proven);
    }
    catch (e) {
        return err([e instanceof Error ? e : new Error(`Unknown error during UCAN verification: ${e}`)]);
    }
});
exports.verify = verify;
//# sourceMappingURL=verify.js.map