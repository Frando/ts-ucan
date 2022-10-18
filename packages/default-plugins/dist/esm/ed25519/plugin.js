var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as ed25519 from "@stablelib/ed25519";
import * as crypto from "./crypto.js";
import { EDWARDS_DID_PREFIX } from "../prefixes.js";
export const ed25519Plugin = {
    prefix: EDWARDS_DID_PREFIX,
    jwtAlg: "EdDSA",
    verifySignature: (did, data, sig) => __awaiter(void 0, void 0, void 0, function* () {
        const publicKey = crypto.didToPublicKey(did);
        return ed25519.verify(publicKey, data, sig);
    })
};
//# sourceMappingURL=plugin.js.map