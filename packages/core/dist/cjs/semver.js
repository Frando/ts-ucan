"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.neq = exports.eq = exports.lte = exports.gt = exports.gte = exports.lt = exports.compare = exports.LT = exports.EQ = exports.GT = exports.format = exports.parse = exports.isSemVer = void 0;
const util_js_1 = require("./util.js");
function isSemVer(obj) {
    return (0, util_js_1.isRecord)(obj)
        && (0, util_js_1.hasProp)(obj, "major") && typeof obj.major === "number"
        && (0, util_js_1.hasProp)(obj, "minor") && typeof obj.minor === "number"
        && (0, util_js_1.hasProp)(obj, "patch") && typeof obj.patch === "number";
}
exports.isSemVer = isSemVer;
// Parsing
const NUM_REGEX = /^0|[1-9]\d*/;
const matchesRegex = (regex) => (str) => {
    const m = str.match(regex);
    if (!m)
        return false;
    return m[0].length === str.length;
};
function parse(version) {
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
exports.parse = parse;
// Formatting/Prettyprinting
function format(semver) {
    return `${semver.major}.${semver.minor}.${semver.patch}`;
}
exports.format = format;
// Comparison
exports.GT = 1;
exports.EQ = 0;
exports.LT = -1;
function comparePart(left, right) {
    // when at least one of them is null
    if (left == null) {
        if (right == null)
            return exports.EQ;
        return exports.LT;
    }
    else if (right == null) {
        return exports.GT;
    }
    // when none of them are null
    if (left > right)
        return exports.GT;
    if (left < right)
        return exports.LT;
    return exports.EQ;
}
function compare(left, right) {
    const l = typeof left === "string" ? parse(left) : left;
    const r = typeof right === "string" ? parse(right) : right;
    return (comparePart(l === null || l === void 0 ? void 0 : l.major, r === null || r === void 0 ? void 0 : r.major) ||
        comparePart(l === null || l === void 0 ? void 0 : l.minor, r === null || r === void 0 ? void 0 : r.minor) ||
        comparePart(l === null || l === void 0 ? void 0 : l.patch, r === null || r === void 0 ? void 0 : r.patch));
}
exports.compare = compare;
function lt(left, right) {
    return compare(left, right) === exports.LT;
}
exports.lt = lt;
function gte(left, right) {
    return !lt(left, right);
}
exports.gte = gte;
function gt(left, right) {
    return compare(left, right) === exports.GT;
}
exports.gt = gt;
function lte(left, right) {
    return !gt(left, right);
}
exports.lte = lte;
function eq(left, right) {
    return compare(left, right) === exports.EQ;
}
exports.eq = eq;
function neq(left, right) {
    return !eq(left, right);
}
exports.neq = neq;
//# sourceMappingURL=semver.js.map