import Plugins from "./plugins.js";
import { DelegationSemantics } from "./attenuation.js";
import { IndexByAudience, StoreI } from "./types.js";
declare type StoreConstructor = {
    new (knownSemantics: DelegationSemantics, index: IndexByAudience): StoreI;
    empty(knownSemantics: DelegationSemantics): StoreI;
    fromTokens(knownSemantics: DelegationSemantics, tokens: Iterable<string> | AsyncIterable<string>): Promise<StoreI>;
};
declare const mkStoreClass: (plugins: Plugins) => StoreConstructor;
export default mkStoreClass;
