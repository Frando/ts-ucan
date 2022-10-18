"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAvailableCryptoKeyPair = void 0;
function isAvailableCryptoKeyPair(keypair) {
    return keypair.publicKey != null && keypair.privateKey != null;
}
exports.isAvailableCryptoKeyPair = isAvailableCryptoKeyPair;
//# sourceMappingURL=types.js.map