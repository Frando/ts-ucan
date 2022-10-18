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
const token = __importStar(require("./token.js"));
const util = __importStar(require("./util.js"));
const types_js_1 = require("./types.js");
const index_js_1 = require("./capability/index.js");
const attenuation_js_1 = require("./attenuation.js");
function isBuildableState(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "issuer") && (0, types_js_1.isKeypair)(obj.issuer)
        && util.hasProp(obj, "audience") && typeof obj.audience === "string"
        && util.hasProp(obj, "expiration") && typeof obj.expiration === "number";
}
function isCapabilityLookupCapableState(obj) {
    return util.isRecord(obj)
        && util.hasProp(obj, "issuer") && (0, types_js_1.isKeypair)(obj.issuer)
        && util.hasProp(obj, "expiration") && typeof obj.expiration === "number";
}
/**
 * A builder API for UCANs.
 *
 * Supports grabbing UCANs from a UCAN `Store` for proofs (see `delegateCapability`).
 *
 * Example usage:
 *
 * ```ts
 * const ucan = await Builder.create()
 *   .issuedBy(aliceKeypair)
 *   .toAudience(bobDID)
 *   .withLifetimeInSeconds(30)
 *   .claimCapability({ email: "my@email.com", cap: "SEND" })
 *   .delegateCapability(emailSemantics, { email: "my-friends@email.com", cap: "SEND" }, proof)
 *   .build()
 * ```
 */
const mkBuilderClass = (plugins) => {
    return class Builder {
        constructor(state, defaultable) {
            this.state = state;
            this.defaultable = defaultable;
        }
        /**
         * Create an empty builder.
         * Before finalising the builder, you need to at least call
         * - `issuedBy`
         * - `toAudience` and
         * - `withLifetimeInSeconds` or `withExpiration`.
         * To finalise the builder, call its `build` or `buildPayload` method.
         */
        static create() {
            return new Builder({}, { capabilities: [], facts: [], proofs: [], addNonce: false });
        }
        /**
         * @param issuer The issuer as a DID string ("did:key:...").
         *
         * The UCAN must be signed with the private key of the issuer to be valid.
         */
        issuedBy(issuer) {
            if (!(0, types_js_1.isKeypair)(issuer)) {
                throw new TypeError(`Expected a Keypair, but got ${issuer}`);
            }
            return new Builder(Object.assign(Object.assign({}, this.state), { issuer }), this.defaultable);
        }
        /**
         * @param audience The audience as a DID string ("did:key:...").
         *
         * This is the identity this UCAN transfers rights to.
         * It could e.g. be the DID of a service you're posting this UCAN as a JWT to,
         * or it could be the DID of something that'll use this UCAN as a proof to
         * continue the UCAN chain as an issuer.
         */
        toAudience(audience) {
            if (typeof audience !== "string") {
                throw new TypeError(`Expected audience DID as string, but got ${audience}`);
            }
            return new Builder(Object.assign(Object.assign({}, this.state), { audience }), this.defaultable);
        }
        /**
         * @param seconds The number of seconds from the calltime of this function
         *   to set the expiry timestamp to.
         */
        withLifetimeInSeconds(seconds) {
            if (typeof seconds !== "number") {
                throw new TypeError(`Expected seconds as number, but got ${seconds}`);
            }
            if (!isFinite(seconds) || seconds <= 0) {
                throw new TypeError(`Expected seconds to be a positive number, but got ${seconds}`);
            }
            return this.withExpiration(Math.floor(Date.now() / 1000) + seconds);
        }
        /**
         * @param expiration The UTCTime timestamp (in seconds) for when the UCAN should expire.
         */
        withExpiration(expiration) {
            if (typeof expiration !== "number" || !isFinite(expiration)) {
                throw new TypeError(`Expected expiration as number, but got ${expiration}`);
            }
            if (this.defaultable.notBefore != null && expiration < this.defaultable.notBefore) {
                throw new Error(`Can't set expiration to ${expiration} which is before 'notBefore': ${this.defaultable.notBefore}`);
            }
            return new Builder(Object.assign(Object.assign({}, this.state), { expiration }), this.defaultable);
        }
        /**
         * @param notBeforeTimestamp The UTCTime timestamp (in seconds) of when the UCAN becomes active.
         */
        withNotBefore(notBeforeTimestamp) {
            if (typeof notBeforeTimestamp !== "number" || !isFinite(notBeforeTimestamp)) {
                throw new TypeError(`Expected notBeforeTimestamp as number, but got ${notBeforeTimestamp}`);
            }
            if (util.hasProp(this.state, "expiration") && typeof this.state.expiration === "number" && this.state.expiration < notBeforeTimestamp) {
                throw new Error(`Can't set 'notBefore' to ${notBeforeTimestamp} which is after expiration: ${this.state.expiration}`);
            }
            return new Builder(this.state, Object.assign(Object.assign({}, this.defaultable), { notBefore: notBeforeTimestamp }));
        }
        withFact(fact, ...facts) {
            if (!util.isRecord(fact) || facts.some(fct => !util.isRecord(fct))) {
                throw new TypeError(`Expected fact(s) to be a record, but got ${fact}`);
            }
            return new Builder(this.state, Object.assign(Object.assign({}, this.defaultable), { facts: [...this.defaultable.facts, fact, ...facts] }));
        }
        /**
         * Will ensure that the built UCAN includes a number used once.
         */
        withNonce() {
            return new Builder(this.state, Object.assign(Object.assign({}, this.defaultable), { addNonce: true }));
        }
        claimCapability(capability, ...capabilities) {
            if (!(0, index_js_1.isCapability)(capability)) {
                throw new TypeError(`Expected capability, but got ${JSON.stringify(capability, null, " ")}`);
            }
            return new Builder(this.state, Object.assign(Object.assign({}, this.defaultable), { capabilities: [...this.defaultable.capabilities, capability, ...capabilities] }));
        }
        delegateCapability(requiredCapability, storeOrProof, semantics) {
            if (!(0, index_js_1.isCapability)(requiredCapability)) {
                throw new TypeError(`Expected 'requiredCapability' as a second argument, but got ${requiredCapability}`);
            }
            if (!isCapabilityLookupCapableState(this.state)) {
                throw new Error(`Can't delegate capabilities without having these paramenters set in the builder: issuer and expiration.`);
            }
            function isProof(proof) {
                return util.hasProp(proof, "capability") || util.hasProp(proof, "ownershipDID");
            }
            if (isProof(storeOrProof)) {
                if (semantics == null) {
                    throw new TypeError(`Expected 'semantics' as third argument if a 'proof' DelegationChain was passed as second.`);
                }
                const proof = storeOrProof;
                const ucan = proof.ucan;
                if (!(0, attenuation_js_1.capabilityCanBeDelegated)(semantics, requiredCapability, proof)) {
                    throw new Error(`Can't add capability to UCAN: Given proof doesn't give required rights to delegate.`);
                }
                return new Builder(this.state, Object.assign(Object.assign({}, this.defaultable), { capabilities: [...this.defaultable.capabilities, requiredCapability], proofs: this.defaultable.proofs.find(p => token.encode(p) === token.encode(ucan)) == null
                        ? [...this.defaultable.proofs, ucan]
                        : this.defaultable.proofs }));
            }
            else {
                const store = storeOrProof;
                const issuer = this.state.issuer.did();
                // we look up a proof that has our issuer as an audience
                const result = util.first(store.findWithCapability(issuer, requiredCapability, issuer));
                if (result != null) {
                    const ucan = result.ucan;
                    const ucanEncoded = token.encode(ucan);
                    return new Builder(this.state, Object.assign(Object.assign({}, this.defaultable), { capabilities: [...this.defaultable.capabilities, requiredCapability], proofs: this.defaultable.proofs.find(proof => token.encode(proof) === ucanEncoded) == null
                            ? [...this.defaultable.proofs, ucan]
                            : this.defaultable.proofs }));
                }
                else {
                    throw new Error(`Couldn't add capability to UCAN. Couldn't find anything providing this capability in given store.`);
                }
            }
        }
        buildPayload() {
            if (!isBuildableState(this.state)) {
                throw new Error(`Builder is missing one of the required properties before it can be built: issuer, audience and expiration.`);
            }
            return token.buildPayload({
                issuer: this.state.issuer.did(),
                audience: this.state.audience,
                expiration: this.state.expiration,
                notBefore: this.defaultable.notBefore,
                addNonce: this.defaultable.addNonce,
                capabilities: this.defaultable.capabilities,
                facts: this.defaultable.facts,
                proofs: this.defaultable.proofs.map(proof => token.encode(proof)),
            });
        }
        build() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isBuildableState(this.state)) {
                    throw new Error(`Builder is missing one of the required properties before it can be built: issuer, audience and expiration.`);
                }
                const payload = this.buildPayload();
                return yield token.signWithKeypair(plugins)(payload, this.state.issuer);
            });
        }
    };
};
exports.default = mkBuilderClass;
//# sourceMappingURL=builder.js.map