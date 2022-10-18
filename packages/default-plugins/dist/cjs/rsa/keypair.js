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
exports.RsaKeypair = void 0;
const one_webcrypto_1 = require("one-webcrypto");
const uint8arrays = __importStar(require("uint8arrays"));
const crypto = __importStar(require("./crypto.js"));
const types_js_1 = require("../types.js");
class RsaKeypair {
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
            if (!(0, types_js_1.isAvailableCryptoKeyPair)(keypair)) {
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
            const arrayBuffer = yield one_webcrypto_1.webcrypto.subtle.exportKey("pkcs8", this.keypair.privateKey);
            return uint8arrays.toString(new Uint8Array(arrayBuffer), format);
        });
    }
}
exports.RsaKeypair = RsaKeypair;
exports.default = RsaKeypair;
//# sourceMappingURL=keypair.js.map