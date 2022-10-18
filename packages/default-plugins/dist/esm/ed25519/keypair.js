var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as uint8arrays from "uint8arrays";
import * as ed25519 from "@stablelib/ed25519";
import * as crypto from "./crypto.js";
export class EdKeypair {
    constructor(secretKey, publicKey, exportable) {
        this.jwtAlg = "EdDSA";
        this.secretKey = secretKey;
        this.publicKey = publicKey;
        this.exportable = exportable;
    }
    static create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { exportable } = params || {};
            const keypair = ed25519.generateKeyPair();
            return new EdKeypair(keypair.secretKey, keypair.publicKey, exportable !== null && exportable !== void 0 ? exportable : false);
        });
    }
    static fromSecretKey(key, params) {
        const { format = "base64pad", exportable = false } = params || {};
        const secretKey = uint8arrays.fromString(key, format);
        const publicKey = ed25519.extractPublicKeyFromSecretKey(secretKey);
        return new EdKeypair(secretKey, publicKey, exportable);
    }
    did() {
        return crypto.publicKeyToDid(this.publicKey);
    }
    sign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return ed25519.sign(this.secretKey, msg);
        });
    }
    export(format = "base64pad") {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exportable) {
                throw new Error("Key is not exportable");
            }
            return uint8arrays.toString(this.secretKey, format);
        });
    }
}
export default EdKeypair;
//# sourceMappingURL=keypair.js.map