var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { webcrypto } from "one-webcrypto";
import * as uint8arrays from "uint8arrays";
import * as crypto from "./crypto.js";
import { isAvailableCryptoKeyPair } from "../types.js";
export class RsaKeypair {
    constructor(keypair, publicKey, exportable) {
        this.jwtAlg = "RS256";
        this.keypair = keypair;
        this.publicKey = publicKey;
        this.exportable = exportable;
    }
    static create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { size = 2048, exportable = false } = params || {};
            const keypair = yield crypto.generateKeypair(size);
            if (!isAvailableCryptoKeyPair(keypair)) {
                throw new Error(`Couldn't generate valid keypair`);
            }
            const publicKey = yield crypto.exportKey(keypair.publicKey);
            return new RsaKeypair(keypair, publicKey, exportable);
        });
    }
    did() {
        return crypto.publicKeyToDid(this.publicKey);
    }
    sign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield crypto.sign(msg, this.keypair.privateKey);
        });
    }
    export(format = "base64pad") {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exportable) {
                throw new Error("Key is not exportable");
            }
            const arrayBuffer = yield webcrypto.subtle.exportKey("pkcs8", this.keypair.privateKey);
            return uint8arrays.toString(new Uint8Array(arrayBuffer), format);
        });
    }
}
export default RsaKeypair;
//# sourceMappingURL=keypair.js.map