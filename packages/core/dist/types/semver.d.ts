export interface SemVer {
    major: number;
    minor: number;
    patch: number;
}
export declare function isSemVer(obj: unknown): obj is SemVer;
export declare function parse(version: string): SemVer | null;
export declare function format(semver: SemVer): string;
export declare const GT = 1;
export declare const EQ = 0;
export declare const LT = -1;
export declare type GT = typeof GT;
export declare type EQ = typeof EQ;
export declare type LT = typeof LT;
export declare function compare(left: SemVer | string, right: SemVer | string): GT | EQ | LT;
export declare function lt(left: SemVer | string, right: SemVer | string): boolean;
export declare function gte(left: SemVer | string, right: SemVer | string): boolean;
export declare function gt(left: SemVer | string, right: SemVer | string): boolean;
export declare function lte(left: SemVer | string, right: SemVer | string): boolean;
export declare function eq(left: SemVer | string, right: SemVer | string): boolean;
export declare function neq(left: SemVer | string, right: SemVer | string): boolean;
