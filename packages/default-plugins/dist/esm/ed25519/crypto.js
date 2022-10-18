import { EDWARDS_DID_PREFIX } from "../prefixes.js";
import { didFromKeyBytes, keyBytesFromDid } from "../util.js";
export const didToPublicKey = (did) => {
    return keyBytesFromDid(did, EDWARDS_DID_PREFIX);
};
export const publicKeyToDid = (pubkey) => {
    return didFromKeyBytes(pubkey, EDWARDS_DID_PREFIX);
};
//# sourceMappingURL=crypto.js.map