"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicKeyToDid = exports.didToPublicKey = void 0;
const prefixes_js_1 = require("../prefixes.js");
const util_js_1 = require("../util.js");
const didToPublicKey = (did) => {
    return (0, util_js_1.keyBytesFromDid)(did, prefixes_js_1.EDWARDS_DID_PREFIX);
};
exports.didToPublicKey = didToPublicKey;
const publicKeyToDid = (pubkey) => {
    return (0, util_js_1.didFromKeyBytes)(pubkey, prefixes_js_1.EDWARDS_DID_PREFIX);
};
exports.publicKeyToDid = publicKeyToDid;
//# sourceMappingURL=crypto.js.map