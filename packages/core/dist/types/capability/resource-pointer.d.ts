import { Superuser } from "./super-user.js";
export declare type ResourcePointer = {
    scheme: string;
    hierPart: Superuser | string;
};
/**
 * Separator for pieces of a URI.
 */
export declare const SEPARATOR: string;
export declare function isResourcePointer(obj: unknown): obj is ResourcePointer;
export declare function as(did: string, resource: Superuser | string): ResourcePointer;
export declare function my(resource: Superuser | string): ResourcePointer;
export declare function prf(selector: Superuser | number): ResourcePointer;
export declare function isEqual(a: ResourcePointer, b: ResourcePointer): boolean;
/**
 * Encode a resource pointer.
 *
 * @param pointer The resource pointer to encode
 */
export declare function encode(pointer: ResourcePointer): string;
/**
 * Parse an encoded resource pointer.
 *
 * @param pointer The encoded resource pointer
 */
export declare function parse(pointer: string): ResourcePointer;
