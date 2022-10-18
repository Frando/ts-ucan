export interface AvailableCryptoKeyPair {
    privateKey: CryptoKey;
    publicKey: CryptoKey;
}
export declare type PublicKeyJwk = {
    kty: string;
    crv: string;
    x: string;
    y: string;
};
export declare type PrivateKeyJwk = PublicKeyJwk & {
    d: string;
};
export declare function isAvailableCryptoKeyPair(keypair: CryptoKeyPair): keypair is AvailableCryptoKeyPair;
