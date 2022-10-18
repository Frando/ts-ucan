import { hasProp, isRecord } from "./util.js";
export function isSemVer(obj) {
    return isRecord(obj)
        && hasProp(obj, "major") && typeof obj.major === "number"
        && hasProp(obj, "minor") && typeof obj.minor === "number"
        && hasProp(obj, "patch") && typeof obj.patch === "number";
}
// Parsing
const NUM_REGEX = /^0|[1-9]\d*/;
const matchesRegex = (regex) => (str) => {
    const m = str.match(regex);
    if (!m)
        return false;
    return m[0].length === str.length;
};
export function parse(version) {
    const parts = version.split(".");
    if (parts.length !== 3) {
        return null;
    }
    if (!parts.every(matchesRegex(NUM_REGEX))) {
        return null;
    }
    const [major, minor, patch] = parts.map(part => parseInt(part, 10));
    if (!Number.isSafeInteger(major) || !Number.isSafeInteger(minor) || !Number.isSafeInteger(patch)) {
        return null;
    }
    if (major < 0 || minor < 0 || patch < 0) {
        return null;
    }
    return { major, minor, patch };
}
// Formatting/Prettyprinting
export function format(semver) {
    return `${semver.major}.${semver.minor}.${semver.patch}`;
}
// Comparison
export const GT = 1;
export const EQ = 0;
export const LT = -1;
function comparePart(left, right) {
    // when at least one of them is null
    if (left == null) {
        if (right == null)
            return EQ;
        return LT;
    }
    else if (right == null) {
        return GT;
    }
    // when none of them are null
    if (left > right)
        return GT;
    if (left < right)
        return LT;
    return EQ;
}
export function compare(left, right) {
    const l = typeof left === "string" ? parse(left) : left;
    const r = typeof right === "string" ? parse(right) : right;
    return (comparePart(l === null || l === void 0 ? void 0 : l.major, r === null || r === void 0 ? void 0 : r.major) ||
        comparePart(l === null || l === void 0 ? void 0 : l.minor, r === null || r === void 0 ? void 0 : r.minor) ||
        comparePart(l === null || l === void 0 ? void 0 : l.patch, r === null || r === void 0 ? void 0 : r.patch));
}
export function lt(left, right) {
    return compare(left, right) === LT;
}
export function gte(left, right) {
    return !lt(left, right);
}
export function gt(left, right) {
    return compare(left, right) === GT;
}
export function lte(left, right) {
    return !gt(left, right);
}
export function eq(left, right) {
    return compare(left, right) === EQ;
}
export function neq(left, right) {
    return !eq(left, right);
}
//# sourceMappingURL=semver.js.map