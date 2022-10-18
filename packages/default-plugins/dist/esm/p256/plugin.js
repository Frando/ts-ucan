var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as crypto from "./crypto.js";
import { P256_DID_PREFIX } from "../prefixes.js";
export const p256Plugin = {
    prefix: P256_DID_PREFIX,
    jwtAlg: "ES256",
    verifySignature: (did, data, sig) => __awaiter(void 0, void 0, void 0, function* () {
        const publicKey = crypto.didToPublicKey(did);
        return crypto.verify(publicKey, data, sig);
    })
};
//# sourceMappingURL=plugin.js.map