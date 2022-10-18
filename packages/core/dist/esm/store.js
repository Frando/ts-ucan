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
import * as token from "./token.js";
import { capabilityCanBeDelegated, delegationChains, rootIssuer } from "./attenuation.js";
const mkStoreClass = (plugins) => {
    return class Store {
        constructor(knownSemantics, index) {
            this.index = index;
            this.knownSemantics = knownSemantics;
        }
        static empty(knownSemantics) {
            return new Store(knownSemantics, {});
        }
        static fromTokens(knownSemantics, tokens) {
            var tokens_1, tokens_1_1;
            var e_1, _a;
            return __awaiter(this, void 0, void 0, function* () {
                const store = Store.empty(knownSemantics);
                try {
                    for (tokens_1 = __asyncValues(tokens); tokens_1_1 = yield tokens_1.next(), !tokens_1_1.done;) {
                        const encodedUcan = tokens_1_1.value;
                        const ucan = yield token.validate(plugins)(encodedUcan);
                        yield store.add(ucan);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return)) yield _a.call(tokens_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return store;
            });
        }
        add(ucan) {
            var e_2, _a;
            var _b;
            return __awaiter(this, void 0, void 0, function* () {
                const audience = ucan.payload.aud;
                const byAudience = (_b = this.index[audience]) !== null && _b !== void 0 ? _b : [];
                const encoded = token.encode(ucan);
                if (byAudience.find(stored => token.encode(stored.processedUcan) === encoded) != null) {
                    return;
                }
                const chains = [];
                try {
                    for (var _c = __asyncValues(delegationChains(plugins)(this.knownSemantics, ucan)), _d; _d = yield _c.next(), !_d.done;) {
                        const delegationChain = _d.value;
                        if (delegationChain instanceof Error) {
                            console.warn(`Delegation chain error while storing UCAN:`, delegationChain);
                            continue;
                        }
                        chains.push(delegationChain);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                // Also do this *after* the all awaits to prevent races.
                if (byAudience.find(stored => token.encode(stored.processedUcan) === encoded) != null) {
                    return;
                }
                byAudience.push({
                    processedUcan: ucan,
                    capabilities: chains
                });
                this.index[audience] = byAudience;
            });
        }
        getByAudience(audience) {
            var _a;
            return ((_a = this.index[audience]) !== null && _a !== void 0 ? _a : []).map(elem => elem.processedUcan);
        }
        findByAudience(audience, predicate) {
            var _a, _b, _c;
            return (_c = (_b = (_a = this.index[audience]) === null || _a === void 0 ? void 0 : _a.find(elem => predicate(elem.processedUcan))) === null || _b === void 0 ? void 0 : _b.processedUcan) !== null && _c !== void 0 ? _c : null;
        }
        *findWithCapability(audience, requiredCapability, requiredIssuer) {
            const cache = this.index[audience];
            if (cache == null) {
                return;
            }
            for (const cacheElement of cache) {
                for (const delegationChain of cacheElement.capabilities) {
                    if (capabilityCanBeDelegated(this.knownSemantics, requiredCapability, delegationChain)
                        && rootIssuer(delegationChain) === requiredIssuer) {
                        yield delegationChain;
                    }
                }
            }
        }
    };
};
export default mkStoreClass;
//# sourceMappingURL=store.js.map