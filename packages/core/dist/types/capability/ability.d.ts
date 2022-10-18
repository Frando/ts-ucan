import { Superuser, SUPERUSER } from "./super-user.js";
export { Superuser, SUPERUSER };
export declare type Ability = Superuser | {
    namespace: string;
    segments: string[];
};
/**
 * Separator for an ability's segments.
 */
export declare const SEPARATOR: string;
/**
 * Ability that can be used with a `prf` resource-pointer.
 * This redelegates all capabilities of the proof(s).
 */
export declare const REDELEGATE: Ability;
export declare function isAbility(obj: unknown): obj is Ability;
export declare function isEqual(a: Ability, b: Ability): boolean;
export declare function joinSegments(segments: string[]): string;
/**
 * Encode an ability.
 *
 * @param ability The ability to encode
 */
export declare function encode(ability: Ability): string;
/**
 * Parse an encoded ability.
 *
 * @param ability The encoded ability
 */
export declare function parse(ability: string): Ability;
