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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
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
import * as token from "./token.js";
import { SUPERUSER } from "./capability/super-user.js";
// FUNCTIONS
/**
 * This computes all possible delegations from given UCAN with given
 * capability delegation semantics.
 *
 * For each entry in the attenuations array of the UCAN there will be at least
 * one delegation chain.
 *
 * These delegation chains are computed lazily, so that if parts of the UCAN have
 * been revoked or can't be loaded, this doesn't keep this function from figuring
 * out different ways of delegating a capability from the attenuations.
 * It also makes it possible to return early if a valid delegation chain has been found.
 */
export const delegationChains = (plugins) => function (semantics, ucan, isRevoked = () => __awaiter(this, void 0, void 0, function* () { return false; })) {
    return __asyncGenerator(this, arguments, function* () {
        if (yield __await(isRevoked(ucan))) {
            yield yield __await(new Error(`UCAN Revoked: ${token.encode(ucan)}`));
            return yield __await(void 0);
        }
        yield __await(yield* __asyncDelegator(__asyncValues(capabilitiesFromParenthood(ucan))));
        yield __await(yield* __asyncDelegator(__asyncValues(capabilitiesFromDelegation(plugins, semantics, ucan, isRevoked))));
    });
};
/**
 * Figures out the implied root issuer from a delegation chain.
 *
 * For a given delegation chain this will give you the DID of who
 * "started" the chain, so who claims to be the "owner" of said capability.
 */
export function rootIssuer(delegationChain) {
    if ("capability" in delegationChain) {
        return delegationChain.chainStep == null
            ? delegationChain.ucan.payload.iss
            : rootIssuer(delegationChain.chainStep);
    }
    return delegationChain.ownershipDID;
}
/**
 * The default delegation semantics.
 * This will just allow equal capabilities to be delegated,
 * except that it also accounts for superuser abilities.
 */
export const equalCanDelegate = {
    canDelegateResource(parentResource, childResource) {
        if (parentResource.scheme !== childResource.scheme) {
            return false;
        }
        return parentResource.hierPart === childResource.hierPart;
    },
    canDelegateAbility(parentAbility, childAbility) {
        if (parentAbility === SUPERUSER) {
            return true;
        }
        if (childAbility === SUPERUSER) {
            return false;
        }
        if (parentAbility.namespace !== childAbility.namespace) {
            return false;
        }
        // Array equality
        if (parentAbility.segments.length !== childAbility.segments.length) {
            return false;
        }
        return parentAbility.segments.reduce((acc, v, i) => acc && childAbility.segments[i] === v, true);
    },
};
export function capabilityCanBeDelegated(semantics, capability, fromDelegationChain) {
    if ("capability" in fromDelegationChain) {
        return canDelegate(semantics, fromDelegationChain.capability, capability);
    }
    const ownershipScope = fromDelegationChain.scope;
    if (ownershipScope === SUPERUSER) {
        return true;
    }
    return ownershipScope.scheme == capability.with.scheme
        && semantics.canDelegateAbility(ownershipScope.ability, capability.can);
}
export function ownershipCanBeDelegated(semantics, did, scope, fromDelegationChain) {
    if (did !== fromDelegationChain.ownershipDID) {
        return false;
    }
    const parentScope = fromDelegationChain.scope;
    // parent OwnershipScope can delegate child OwnershipScope
    if (parentScope === SUPERUSER) {
        return true;
    }
    if (scope === SUPERUSER) {
        return false;
    }
    return parentScope.scheme === scope.scheme
        && semantics.canDelegateAbility(parentScope.ability, scope.ability);
}
// ㊙️ Internal
function* capabilitiesFromParenthood(ucan) {
    for (const capability of ucan.payload.att) {
        switch (capability.with.scheme.toLowerCase()) {
            // If it's a "my" capability, it'll indicate an ownership delegation
            case "my": {
                const scope = capability.with.hierPart === SUPERUSER
                    ? SUPERUSER
                    : { scheme: capability.with.hierPart, ability: capability.can };
                yield {
                    ownershipDID: ucan.payload.iss,
                    scope,
                    ucan,
                };
                break;
            }
            // if it's another known capability, we can ignore them
            // (they're not introduced by parenthood)
            case "as":
            case "prf":
                break;
            // otherwise we assume it's a normal parenthood capability introduction
            default:
                yield { capability, ucan };
        }
    }
}
function capabilitiesFromDelegation(plugins, semantics, ucan, isRevoked) {
    return __asyncGenerator(this, arguments, function* capabilitiesFromDelegation_1() {
        var e_1, _a;
        let proofIndex = 0;
        try {
            for (var _b = __asyncValues(token.validateProofs(plugins)(ucan)), _c; _c = yield __await(_b.next()), !_c.done;) {
                const proof = _c.value;
                if (proof instanceof Error) {
                    yield yield __await(proof);
                    continue;
                }
                for (const capability of ucan.payload.att) {
                    try {
                        switch (capability.with.scheme.toLowerCase()) {
                            case "my": continue; // cannot be delegated, only introduced by parenthood.
                            case "as": {
                                yield __await(yield* __asyncDelegator(__asyncValues(handleAsDelegation(plugins, semantics, capability, ucan, proof, isRevoked))));
                                break;
                            }
                            case "prf": {
                                yield __await(yield* __asyncDelegator(__asyncValues(handlePrfDelegation(plugins, semantics, capability, ucan, proof, proofIndex, isRevoked))));
                                break;
                            }
                            default: {
                                yield __await(yield* __asyncDelegator(__asyncValues(handleNormalDelegation(plugins, semantics, capability, ucan, proof, isRevoked))));
                            }
                        }
                    }
                    catch (e) {
                        yield yield __await(error(e));
                    }
                }
                proofIndex++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
            }
            finally { if (e_1) throw e_1.error; }
        }
        function error(e) {
            if (e instanceof Error) {
                return e;
            }
            else {
                return new Error(`Error during capability delegation checking: ${e}`);
            }
        }
    });
}
function handleAsDelegation(plugins, semantics, capability, ucan, proof, isRevoked) {
    return __asyncGenerator(this, arguments, function* handleAsDelegation_1() {
        var e_2, _a;
        const split = capability.with.hierPart.split(":");
        const scheme = split[split.length - 1];
        const ownershipDID = split.slice(0, -1).join(":");
        const scope = scheme === SUPERUSER
            ? SUPERUSER
            : { scheme, ability: capability.can };
        try {
            for (var _b = __asyncValues(delegationChains(plugins)(semantics, proof, isRevoked)), _c; _c = yield __await(_b.next()), !_c.done;) {
                const delegationChain = _c.value;
                if (delegationChain instanceof Error) {
                    yield yield __await(delegationChain);
                    continue;
                }
                if (!("ownershipDID" in delegationChain)) {
                    continue;
                }
                if (ownershipCanBeDelegated(semantics, ownershipDID, scope, delegationChain)) {
                    yield yield __await({
                        ownershipDID,
                        scope,
                        ucan,
                        chainStep: delegationChain
                    });
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
function handlePrfDelegation(plugins, semantics, capability, ucan, proof, proofIndex, isRevoked) {
    return __asyncGenerator(this, arguments, function* handlePrfDelegation_1() {
        var e_3, _a;
        if (capability.with.hierPart !== SUPERUSER
            && parseInt(capability.with.hierPart, 10) !== proofIndex) {
            // if it's something like prf:2, we need to make sure that
            // we only process the delegation if proofIndex === 2
            return yield __await(void 0);
        }
        try {
            for (var _b = __asyncValues(delegationChains(plugins)(semantics, proof, isRevoked)), _c; _c = yield __await(_b.next()), !_c.done;) {
                const delegationChain = _c.value;
                if (delegationChain instanceof Error) {
                    yield yield __await(delegationChain);
                    continue;
                }
                if (!("capability" in delegationChain)) {
                    continue;
                }
                yield yield __await({
                    capability: delegationChain.capability,
                    ucan,
                    chainStep: delegationChain
                });
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
            }
            finally { if (e_3) throw e_3.error; }
        }
    });
}
function handleNormalDelegation(plugins, semantics, capability, ucan, proof, isRevoked) {
    return __asyncGenerator(this, arguments, function* handleNormalDelegation_1() {
        var e_4, _a;
        try {
            for (var _b = __asyncValues(delegationChains(plugins)(semantics, proof, isRevoked)), _c; _c = yield __await(_b.next()), !_c.done;) {
                const delegationChain = _c.value;
                if (delegationChain instanceof Error) {
                    yield yield __await(delegationChain);
                    continue;
                }
                if (!capabilityCanBeDelegated(semantics, capability, delegationChain)) {
                    continue;
                }
                yield yield __await({
                    capability,
                    ucan,
                    chainStep: delegationChain
                });
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
            }
            finally { if (e_4) throw e_4.error; }
        }
    });
}
function canDelegate(semantics, parentCapability, childCapability) {
    return semantics.canDelegateResource(parentCapability.with, childCapability.with)
        && semantics.canDelegateAbility(parentCapability.can, childCapability.can);
}
//# sourceMappingURL=attenuation.js.map