export declare function keyBytesFromDid(did: string, expectedPrefix: Uint8Array): Uint8Array;
export declare function didFromKeyBytes(publicKeyBytes: Uint8Array, prefix: Uint8Array): string;
/**
 * Determines if a Uint8Array has a given indeterminate length-prefix.
 */
export declare const hasPrefix: (prefixedKey: Uint8Array, prefix: Uint8Array) => boolean;
