export declare const RSA_ALG = "RSASSA-PKCS1-v1_5";
export declare const DEFAULT_KEY_SIZE = 2048;
export declare const DEFAULT_HASH_ALG = "SHA-256";
export declare const SALT_LEGNTH = 128;
export declare const generateKeypair: (size?: number) => Promise<CryptoKeyPair>;
export declare const exportKey: (key: CryptoKey) => Promise<Uint8Array>;
export declare const importKey: (key: Uint8Array) => Promise<CryptoKey>;
export declare const sign: (msg: Uint8Array, privateKey: CryptoKey) => Promise<Uint8Array>;
export declare const verify: (pubKey: Uint8Array, msg: Uint8Array, sig: Uint8Array) => Promise<boolean>;
export declare const didToPublicKey: (did: string) => Uint8Array;
export declare const oldDidToPublicKey: (did: string) => Uint8Array;
export declare const publicKeyToDid: (pubkey: Uint8Array) => string;
export declare const publicKeyToOldDid: (pubkey: Uint8Array) => string;
export declare const convertRSAPublicKeyToSubjectPublicKeyInfo: (rsaPublicKey: Uint8Array) => Uint8Array;
export declare const convertSubjectPublicKeyInfoToRSAPublicKey: (subjectPublicKeyInfo: Uint8Array) => Uint8Array;
export declare function asn1DERLengthEncode(length: number): Uint8Array;
export declare function asn1DERLengthDecode(bytes: Uint8Array): number;
